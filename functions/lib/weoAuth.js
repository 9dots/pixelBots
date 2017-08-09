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
    console.log(req.body)
    const {uid} = JSON.parse(req.body)
    console.log(uid)
    return admin.auth().createCustomToken(uid)
      .then(token => res.status(200).send({
        token
      }))
      .catch((e) => {
        console.error(e)
        return res.status(500).send(e)
      })
  })
})
