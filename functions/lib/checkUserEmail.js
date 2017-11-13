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
  const { email, username } = req.body
  Promise.all([
    getUser(),
    usernameRef
      .child(username)
      .once('value')
      .then(snap => snap.exists())
  ])
    .then(
      ([user, taken]) =>
        taken
          ? Promise.reject({ field: 'username', message: 'Username is taken.' })
          : res.status(200).send({ status: 'success', payload: username })
    )
    .catch(e => {
      if (e.code === 'auth/user-not-found') {
        return res.status(200).send({ status: 'success' })
      }
      res.status(200).send({ status: 'failed', payload: e })
    })

  function getUser () {
    if (!email) {
      return Promise.resolve()
    }
    return admin
      .auth()
      .getUserByEmail(email)
      .then(user => Promise.all([getUsername(user), Promise.resolve(user)]))
      .then(([username, user]) =>
        Promise.reject({
          field: 'email',
          message: 'Email is taken',
          user: Object.assign({}, user, { username })
        })
      )
      .catch(e => {
        if (e.code === 'auth/user-not-found') {
          return Promise.resolve()
        }
        return Promise.reject(e)
      })
  }

  function getUsername (user) {
    return usersRef
      .child(user.uid)
      .child('username')
      .once('value')
      .then(snap => snap.val())
  }
}
