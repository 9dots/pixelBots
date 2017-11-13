/**
 * Imports
 */

const admin = require('firebase-admin')

const usersRef = admin.database().ref('/users')
const usernameRef = admin.database().ref('/usernames')

/**
 * Retrieve and return a login token
 */

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(500).send({ status: 'failed', payload: 'Can Only Post' })
  }
  const { username } = req.body

  usernameRef
    .child(username)
    .once('value')
    .then(snap => snap.val())
    .then(userRef => {
      if (userRef) {
        return usersRef
          .child(userRef)
          .once('value')
          .then(user =>
            res.status(200).send({
              status: 'success',
              payload: Object.assign({}, user, { uid: userRef })
            })
          )
      }
      return Promise.reject({
        field: 'username',
        message: 'Not an existing student.'
      })
    })
    .catch(e => {
      if (e.code === 'auth/user-not-found') {
        return res.status(200).send({ status: 'success' })
      }
      res.status(200).send({ status: 'failed', payload: e })
    })
}
