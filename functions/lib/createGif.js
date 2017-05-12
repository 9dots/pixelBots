
const animalApis = require('../utils/animalApis/index').default
const {createPaintFrames} = require('../utils/frameReducer')
const getIterator = require('../utils/getIterator')
const {gifFrame} = require('../utils/createImage')
const functions = require('firebase-functions')
const createGif = require('../utils/createGif')
const {upload} = require('../utils/storage')
const flatten = require('lodash/flatten')
const admin = require('firebase-admin')
const chunk = require('lodash/chunk')
const fs = require('node-fs-extra')
const Promise = require('bluebird')
const omit = require('@f/omit')
const co = require('co')

const RUN_TIME = 3
const GIF_SIZE = 500
const db = admin.database()
const savedRef = db.ref('/saved')
const gamesRef = db.ref('/games')

module.exports = functions.database.ref('/saved/{saveID}/completed')
  .onWrite(evt => {
    if (!evt.data.val()) {
      return
    }
    return new Promise((resolve, reject) => {
      const {saveID} = evt.params
      evt.data.ref.parent.once('value')
        .then(snap => Promise.all([
          Promise.resolve(snap.val()),
          snap.val().gameRef
            ? gamesRef.child(snap.val().gameRef).once('value').then(snap => snap.val())
            : Promise.reject(new Error('no game'))
        ]))
        .then(([{animals}, gameState]) => {
          const levelSize = gameState.levelSize[0]
          const timing = (levelSize * levelSize) / RUN_TIME
          const delay = 100 / timing
          const size = Math.floor(GIF_SIZE / levelSize)
          const imageSize = Number(size * levelSize) + Number(levelSize - 1)
          const {sequence} = animals[0]
          fs.mkdirsSync(`/tmp/${saveID}`)
          const initState = Object.assign({}, gameState, {
            animals: animals.map(a => Object.assign({}, a, {current: a.initial}))
          })
          const it = getIterator(sequence, animalApis[animals[0].type].default(0))
          const frames = createPaintFrames(initState, it)
          const adjusted = frames.map((frame, i, arr) => {
            const next = arr[i + 1]
              ? arr[i + 1].frame
              : frame.frame
            return {length: Math.abs(next - frame.frame), frame: omit('frame', frame)}
          })
          frameChunks(chunk(adjusted, 20))
            .then((results) => createGif(saveID, results, delay, imageSize))
            .then(upload)
            .then(updateGame(saveID))
            .then(success)
            .catch(failed)

          function frameChunks (chunks) {
            return new Promise((resolve, reject) => {
              co(function * () {
                let completed = []
                for (var i = 0; i < chunks.length; i++) {
                  var result = yield frameChunk(chunks[i], i)
                  completed.push(result)
                }
                return flatten(completed)
              }).then(resolve)
            })
          }

          function frameChunk (frames, batch) {
            return new Promise((resolve, reject) => {
              const promises = frames.map((frame, i) => {
                return Promise.join(
                  gifFrame(`${padLeft('' + batch, 2, '0')}-${padLeft('' + i, 4, '0')}`, size, imageSize, frame.frame, saveID),
                  Promise.resolve(frame.length),
                  (img, length) => ({img, length})
                )
              })
              Promise.all(promises)
                .then(resolve)
                .catch(reject)
            })
          }
        })
        .catch(failed)

      function success () {
        console.log('success')
        clearData(saveID)
        resolve()
      }

      function failed (e) {
        console.log('failed', e)
        clearData(saveID)
        reject(e)
      }
    })
  })

function clearData (name) {
  fs.removeSync(`/tmp/${name}.gif`)
  return fs.removeSync(`/tmp/${name}`)
}

function padLeft (str, num, char) {
  const add = num - str.length
  let newStr = ''
  for (let i = 0; i < add; i++) {
    newStr += char
  }
  return newStr + str
}

function updateGame (saveID) {
  return function (url) {
    return savedRef.child(saveID).update({
      lastEdited: Date.now(),
      animatedGif: url,
      'meta/animatedGif': url
    })
  }
}
