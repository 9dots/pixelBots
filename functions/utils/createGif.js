const gm = require('gm').subClass({imageMagick: true})
const chunk = require('lodash/chunk')
const Promise = require('bluebird')
const path = require('path')
const co = require('co')

module.exports = function (fileName, images, delay = 0, imageSize) {
  const imageDelay = delay < 2 ? 2 : delay
  const chunked = chunk(images, 50)
  return new Promise((resolve, reject) => {
    createGifs(chunks, imageSize, imageDelay,  fileName)
      .then((chunkGifs) => {
        let file = gm(imageSize, imageSize, '#ffffff')
          .limit('memory', '1448MB')
          .dispose('none')
        chunkGifs.forEach((path, i, arr) => {
          if (i === arr.length) {
            file.in('-delay', 300).in(path)
          } else {
            file.in(path)
          }
        })
        const writePath = `/tmp/${fileName}.gif`
        file.write(writePath, (err) => {
          if (err) return reject(err)
          return resolve(writePath)
        })
      })
    .catch(reject)
  })
}

function createGifs (chunks, imageSize, imageDelay, fileName) {
  return new Promise((resolve, reject) => {
    co(function * () {
      let completed = []
      for (var i = 0; i < chunks.length; i++) {
        var result = yield frameChunk(chunks[i], imageSize, imageDelay, fileName, i)
        completed.push(result)
      }
      return flatten(completed)
    }).then(resolve)
  })
}

function createGif (images, imageSize, imageDelay, fileName, i) {
  return new Promise((resolve, reject) => {
    let file = gm(imageSize, imageSize, '#ffffff')
      .limit('memory', '1448MB')
      .dispose('none')
    images.forEach(({img, length = 1}, i, arr) => {
      file.in('-delay', imageDelay * (length || 1)).in(img)
    })
    const writePath = `/tmp/${fileName}-${i}.gif`
    file.write(writePath, (err) => {
      if (err) return reject(err)
      return resolve(writePath)
    })
  })
}
