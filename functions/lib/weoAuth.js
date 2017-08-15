/**
 * Imports
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})

/**
 * Retrieve and return a playlist
 */

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const {uid} = JSON.parse(req.body)
    admin.auth().createCustomToken(uid)
      .then(customToken => res.status(200).send({
        token
      }))
      .catch(() => res.status(500).send('broken'))
  })
})
