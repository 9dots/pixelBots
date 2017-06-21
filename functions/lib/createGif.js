
const {createPaintFrames, createFrames, getIterator} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const createVideo = require('../utils/createVideo')
const {gifFrame} = require('../utils/createImage')
const functions = require('firebase-functions')
const createGif = require('../utils/createGif')
const {upload} = require('../utils/storage')
const flatten = require('lodash/flatten')
const admin = require('firebase-admin')
const chunk = require('lodash/chunk')
const fs = require('node-fs-extra')
const Promise = require('bluebird')
const srand = require('@f/srand')
const omit = require('@f/omit')
const co = require('co')

const createApi = animalApis.default
const teacherBot = animalApis.capabilities

const RUN_TIME = 4
const GIF_SIZE = 420
const db = admin.database()
const savedRef = db.ref('/saved')
const gamesRef = db.ref('/games')

module.exports = functions.database.ref('/saved/{saveID}/completions')
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
        .then(([savedGame, gameState]) => {
          const levelSize = gameState.levelSize[0]
          const {animals} = gameState.type === 'read' ? gameState : savedGame
          const size = getSize(levelSize)
          const imageSize = size * levelSize
          const teacherApi = createApi(teacherBot, 0, savedGame.palette)
          const startCode = gameState.advanced
            ? getIterator(gameState.initialPainted, teacherApi)
            : gameState.initialPainted
          const initialPainted = gameState.advanced
            ? createPainted(Object.assign({}, gameState, {
                painted: {},
                startGrid: {},
                animals: animals.filter(a => a.type === 'teacherBot').map(a => Object.assign({}, a, {current: a.initial})),
                rand: srand(1)
              }), startCode)
            : startCode
          const {sequence} = gameState.type === 'read'
            ? gameState.animals[0]
            : animals[0]
          console.log('initialized variables')
          fs.mkdirsSync(`/tmp/${saveID}`)
          const initState = Object.assign({}, gameState, {
            painted: initialPainted || {},
            animals: animals.map(a => Object.assign({}, a, {
              current: a.initial
            }))
          })
          console.log('made init state')
          const it = getIterator(sequence, createApi(gameState.capabilities, 0, savedGame.palette))
          const frames = createPaintFrames(initState, it)
          console.log('done with frames')
          const timing = RUN_TIME / frames.length
          const adjusted = frames.map((frame, i, arr) => {
            return {frame: frame}
          })
          frameChunks(chunk(adjusted, 2))
            .then((results) => createVideo(saveID, results, timing, imageSize))
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
                console.log(process.memoryUsage())
                return Promise.join(
                  gifFrame(`${padLeft('' + batch)}-${padLeft('' + i, 4, '0')}`, size, imageSize, frame.frame, saveID),
                  Promise.resolve(1),
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

function padLeft (str, num = 2, char = '0') {
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

function getSize (size) {
  const floorSize = Math.floor(GIF_SIZE / size)
  return floorSize % 2 === 0
    ? floorSize
    : floorSize - 1
}

function createPainted (state, code) {
  return createFrames(state, code).pop().painted
}
