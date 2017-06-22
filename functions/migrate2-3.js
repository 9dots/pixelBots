const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const reduce = require('@f/reduce')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const db = admin.database()
const gamesRef = db.ref('/games')

// Add description to game meta

// gamesRef.once('value')
//   .then(snap => snap.val())
//   .then(games => Promise.all(
//     mapValues((game, key) => (
//       gamesRef
//         .child(key)
//         .child('meta')
//         .update({
//           description: game.description || ''
//         })
//     ), games)
//   ))
//   .then(() => console.log('done'))
//   .catch(console.error)

// Add count to completed playlists

const playlistsRef = db.ref('/playlistsByUser')
const usersRef = db.ref('/users')

playlistsRef.once('value')
  .then(snap => snap.val())
  .then(users => mapValues((user, key) => {
    const count = Object.keys(user.completed || {}).length
    return [
      playlistsRef.child(key).child('completedCount').set(count),
      usersRef.child(key).child('stats').child('completedPlaylists').set(count)
    ]
  }, users))
  .then(() => console.log('done'))
  .catch(console.error)
