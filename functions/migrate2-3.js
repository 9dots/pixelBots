const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const reduce = require('@f/reduce')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const gamesRef = db.ref('/games')

// Add description to game meta

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(
    mapValues((game, key) => (
      gamesRef
        .child(key)
        .child('meta')
        .update({
          description: game.description || ''
        })
    ), games)
  ))
  .then(() => console.log('done adding description to meta'))
  .catch(console.error)

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
  .then(() => console.log('done counting playlists'))
  .catch(console.error)

// Remove student showcase

const savedRef = db.ref('/saved')

usersRef.once('value')
  .then(snap => snap.val())
  .then(users => Promise.all(mapValues((user, key) => usersRef.child(key).update({showcase: null}), users)))
  .then(() => console.log('remove showcase from profile'))
  .catch(console.error)

savedRef.once('value')
  .then(snap => snap.val())
  .then(saves => Promise.all(mapValues((s, key) => savedRef.child(key).child('meta').update({shared: null}), saves)))
  .then(() => console.log('remove shared from saved'))
  .catch(console.error)
