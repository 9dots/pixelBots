const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const fs = require('fs')
const FPS = 60

const files = fs
  .readdirSync('/tmp/-KmhME6m-_0huayp14UQ10')
  .map(file => `file '/tmp/-KmhME6m-_0huayp14UQ10/${file}'\nduration 0.02\n`)
  .join()
  .replace(/\,/g, '')
fs.writeFileSync(`/tmp/-KmhME6m-_0huayp14UQ10.txt`, files)

const movie = new ffmpeg()
movie
  .size('506x506')
  .addInput('/tmp/-KmhME6m-_0huayp14UQ10.txt')
  .inputOptions(['-safe 0','-f concat'])
  .on('start', function(ffmpegCommand) {
    console.log(`started creating bg video`);
  })
  .on('progress', function(data) {
      console.log('progressing');
  })
  .on('end', function() {
      console.log(`ended creating bg video`);
  })
  .on('error', function(err, stdout, stderr) {
      /// error handling
      console.log('error: ' + err.message);
      console.log('stderr:' + stderr);
      console.log('stdout:' + stdout);
  })
  .outputOptions([`-vf fps=${FPS}`])
  .output(`/tmp/-KmhME6m-_0huayp14UQ10.webm`)
  .run()
