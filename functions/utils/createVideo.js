const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const Ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
Ffmpeg.setFfmpegPath(ffmpegPath)

module.exports = function (fileName, images, delay, imageSize, batch) {
  console.time('create video')
  return new Promise((resolve, reject) => {
    const files = images
      .map(({img, length}, i) => {
        if (i === images.length - 1) {
          return `file ${img}\nduration 3\nfile ${img}`
        } else if (i === 0) {
          return `file ${img}\nduration ${(delay * length) + 1}\n`
        }
        return `file ${img}\nduration ${delay * length}\n`
      })
      .join('')
      .replace(/,/g, '')
    fs.writeFileSync(`/tmp/${fileName}.txt`, files)

    new Ffmpeg()
      .addInput(`/tmp/${fileName}.txt`)
      .inputOptions(['-safe 0', '-f concat'])
      .on('error', reject)
      .on('end', () => {
        console.timeEnd('create video')
        resolve(`/tmp/${fileName}.mp4`)
      })
      .videoCodec('libx264')
      .size(`${imageSize}x${imageSize}`)
      .output(`/tmp/${fileName}.mp4`)
      .outputOptions(['-vf fps=30', '-pix_fmt yuv420p'])
      .run()
  })
}
