/**
 * Imports
 */

const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const admin = require('firebase-admin')
const reduce = require('@f/reduce')

const usersRef = admin.database().ref('/users')
const usernameRef = admin.database().ref('/usernames')
// const createUser = admin.auth().createUser

/**
 * Retrieve and return a login token
 */

module.exports = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') return res.status(500).send({status: 'failed', payload: 'Can Only Post'})
    const {name, username, email, classId} = req.body
    const classRef = admin.database().ref('/classes').child(classId).child('students')
    const displayName = `${name.givenName} ${name.familyName}`
    usernameRef.child(username).once('value')
      .then(snap => snap.exists())
      .then(taken => taken ? Promise.reject('Username is taken.') : Promise.resolve())
      .then(() => admin.auth().createUser({displayName, email}))
      .then(updateRefsWithUser)
      .then(() => res.status(200).send({status: 'success'}))
      .catch(e => {
        console.error(e)
        res.status(200).send({status: 'failed', payload: e})
      })

    function updateRefsWithUser (user) {
      console.log(user, user.uid)
      return Promise.all([
        usersRef.child(user.uid).update({
          displayName: user.displayName,
          studentOf: {
            [classId]: true
          },
          username
        }),
        classRef.update({
          [user.uid]: true
        }),
        usernameRef.child(username).set(user.uid)
      ])
    }
  })
})
