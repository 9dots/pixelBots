const {gifFrame} = require('../utils/createImage')
const functions = require('firebase-functions')
const createGif = require('../utils/createGif')
const {upload} = require('../utils/storage')
const cleanUp = require('../utils/cleanUp')
const flatten = require('lodash/flatten')
const admin = require('firebase-admin')
const chunk = require('lodash/chunk')
const fs = require('node-fs-extra')
const Promise = require('bluebird')
const omit = require('@f/omit')
const co = require('co')

const RUN_TIME = 3
const db = admin.database()
const savedRef = db.ref('/saved')

module.exports = functions.database.ref('/queue/tasks/createGif/{pushID}')
  .onWrite(evt => {
    if (!evt.data.val()) {
      return
    }
    const clean = cleanUp('createGif', evt.params.pushID)
    return new Promise((resolve, reject) => {
      const {frames, saveID, gridSize = 5} = evt.data.val()
      const timing = (gridSize * gridSize) / RUN_TIME
      const delay = 100 / timing
      const size = Math.floor(300 / gridSize)
      const imageSize = Number(size * gridSize) + Number(gridSize - 1)
      fs.mkdirsSync(`/tmp/${saveID}`)

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
        .then(clean)
        .then(success)
        .catch(failed)

      function success () {
        clearData(saveID)
        console.log('success')
        resolve()
      }

      function failed (e) {
        clearData(saveID)
        reject(e)
      }

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

      function clearData (name) {
        fs.removeSync(`/tmp/${name}.gif`)
        return fs.removeSync(`/tmp/${name}`)
      }
    })
  })


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
    return savedRef.child(saveID).update({lastEdited: Date.now(), animatedGif: url})
  }
}

function promiseState (p) {
  return p.then((val) => ({state: 'resolved', val}))
          .catch((e) => ({state: 'rejected', val: e}))
}

