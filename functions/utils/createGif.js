const gm = require('gm').subClass({imageMagick: true})
const Promise = require('bluebird')
const path = require('path')

module.exports = function (fileName, images, delay = 0, imageSize) {
  const imageDelay = delay < 2 ? 2 : delay
  return new Promise((resolve, reject) => {
    let file = gm(imageSize, imageSize, '#ffffff')
      .limit('memory', '1448MB')
      .dispose('none')
    images.forEach(({img, length}, i, arr) => {
      if (i === arr.length - 1) {
        file.in('-delay', 300).in(img)
      } else {
        file.in('-delay', imageDelay * length).in(img)
      }
    })
    const writePath = `/tmp/${fileName}.gif`
    file.write(writePath, (err) => {
      if (err) return reject(err)
      return resolve(writePath)
    })
  })
}
