const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const Promise = require('bluebird')
ffmpeg.setFfmpegPath(ffmpegPath)
const fs = require('fs')

const FPS = 60

module.exports = function (fileName, images, delay = 0, imageSize) {
  console.log(images)
  return new Promise((resolve, reject) => {
    const files = images
      .map(({img}) => `file '${img}'\nduration 0.02\n`)
      .join()
      .replace(/\,/g, '')
    console.log('files', files)
    fs.writeFileSync(`/tmp/${fileName}.txt`, files)

    const movie = new ffmpeg()
    movie
      .size(`${imageSize}x${imageSize}`)
      .addInput(`/tmp/${fileName}.txt`)
      .inputOptions(['-safe 0','-f concat'])
      .on('start', function(ffmpegCommand) {
        console.log(`started creating bg video`);
      })
      .on('progress', function(data) {
          console.log('progressing');
      })
      .on('end', function() {
          console.log(`ended creating bg video`);
          resolve(`/tmp/${fileName}.mp4`)
      })
      .on('error', function(err, stdout, stderr) {
          /// error handling
          console.log('error: ' + err.message);
          console.log('stderr:' + stderr);
          console.log('stdout:' + stdout);
          reject(err)
      })
      .outputOptions(['-pix_fmt yuv420p'])
      .output(`/tmp/${fileName}.mp4`)
      .run()
  })


}
