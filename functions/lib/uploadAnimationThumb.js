/**
 * Imports
 */

const injectToGame = require('../utils/addToFirebase')
const { upload } = require('../utils/storage')
const fs = require('node-fs-extra')

const admin = require('firebase-admin')
const sandboxRef = admin.database().ref('/sandbox')
const removeTempFiles = path => fs.remove(path)

/**
 * Retrieve and return a login token
 */

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(500).send({ status: 'failed', payload: 'Can Only Post' })
  }
  const { uri, ref } = req.body

  sandboxRef
    .child(ref)
    .once('value')
    .then(snap => snap.exists())
    .then(
      () =>
        new Promise((resolve, reject) => {
          const regex = /^data:.+\/(.+);base64,(.*)$/
          const matches = uri.match(regex)
          const data = matches[2]
          const buffer = Buffer.from(data, 'base64')
          fs.writeFileSync(`/tmp/${ref}.png`, buffer)
          resolve(`/tmp/${ref}.png`)
        })
    )
    .then(upload)
    .then(res => injectToGame(`/sandbox/${ref}/imageUrl`, res))
    .then(success)
    .catch(failed)

  function failed (e) {
    removeTempFiles(`/tmp/${ref}.png`)
    return res.status(200).send({ status: 'failed', error: e })
  }

  function success () {
    removeTempFiles(`/tmp/${ref}.png`)
    return res.status(200).send({ status: 'success' })
  }
}
