const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const map = require('@f/map')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const playlistsByUserRef = db.ref('/playlistsByUser')

// Add stretch to game meta

// gamesRef.once('value')
//   .then(snap => snap.val())
//   .then(games => Promise.all(
//     mapValues((game, key) => (
//       gamesRef
//         .child(key)
//         .child('meta')
//         .update({
//           stretch: game.stretch || null
//         })
//     ), games)
//   ))
//   .then(() => console.log('done adding stretch to meta'))
//   .catch(console.error)

playlistsByUserRef
  .once('value')
  .then(snap => snap.val())
  .then(playlistsByUser =>
    Promise.all(
      mapValues(({ byPlaylistRef, inProgress }, key) => {
        console.log(key)
        return playlistsByUserRef
          .child(key)
          .child('inProgress')
          .update(
            map(
              (val, progressKey) =>
                isActiveInstance(val.playlistRef, progressKey, byPlaylistRef)
                  ? val
                  : null,
              inProgress || {}
            )
          )
        // return mapValues(({playlistRef}) => {
        //   if (byPlaylistRef[playlistRef].instanceRef !== )
        // }, inProgress)
      }, playlistsByUser || {})
    )
  )
  .then(() => console.log('done adding stretch to errors'))
  .catch(console.error)

function isActiveInstance (playlistRef, key, byPlaylistRef) {
  console.log(playlistRef)
  return (
    !byPlaylistRef ||
    !byPlaylistRef[playlistRef] ||
    byPlaylistRef[playlistRef].instanceRef === key
  )
}

// savedRef.once('value')
//   .then(snap => snap.val())
//   .then(saved => Promise.all(
//     mapValues((save, key) => (
//       savedRef
//         .child(key)
//         .child('meta')
//         .update({
//           badges: save.badges || null
//         })
//     ), saved)
//   ))
//   .then(() => console.log('done adding badges to meta'))
//   .catch(console.error)
