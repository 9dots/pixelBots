var storage = require('@google-cloud/storage')({
  projectId: 'artbot-26016',
  keyFilename: './service.json'
})
const Promise = require('bluebird')
var fs = require('fs')

const bucket = storage.bucket('artbot-26016.appspot.com')

function downloadFromBucket (dir, name) {
  const newPath = `/tmp/${dir}/${name}`
  return new Promise((resolve, reject) => {
    bucket.file(name).download({destination: newPath})
      .then(() => resolve(newPath))
      .catch((e) => reject(e))
  })
}

function uploadToBucket (img) {
  return new Promise((resolve, reject) => {
    console.log(img)
    if (!img) return reject('no image')
    bucket.upload(img, {resumable: false}, (err, file) => {
      if (err) {
        if (err.code === 'ECONNRESET') {
          return uploadToBucket(img)
        }
        return reject(err)
      }
      file.getSignedUrl({
        action: 'read',
        expires: '03-17-2025'
      }, function (err, signedUrl) {
        if (err) {
          return reject(err)
        }
        return resolve(signedUrl)
      })
    })
  })
}

exports.download = downloadFromBucket
exports.upload = uploadToBucket
