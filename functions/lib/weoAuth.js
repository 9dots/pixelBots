/**
 * Imports
 */

const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const admin = require('firebase-admin')

/**
 * Retrieve and return a login token
 */

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const {uid, keepAlive} = req.body
    if (keepAlive) return res.status(200).send({status: 'success', payload: 'ok'})
    if (uid) {
      return admin.auth().createCustomToken(uid)
      .then(token => res.status(200).send({
        status: 'success',
        payload: token
      }))
      .catch((e) => {
        console.error(e)
        return res.status(500).send({status: 'failed', payload: e})
      })
    } else {
      return res.status(500).send({status: 'failed', payload: 'no uid'})
    }
  })
})
