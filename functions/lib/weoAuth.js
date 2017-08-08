/**
 * Imports
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const cors = require('cors')({origin: true})

/**
 * Retrieve and return a playlist
 */

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const {token} = JSON.parse(req.body)
    const {id, displayName, username} = jwt.verify(token, functions.config().weo.secret)
    admin.auth().createCustomToken(id)
        .then(customToken => res.status(200).send({
          token: customToken,
          displayName,
          username
        }))
        .catch(() => res.status(500).send('broken'))
  })
})
