const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const map = require('@f/map')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const db = admin.database()
const instancesRef = db.ref('/playlistInstances')
const playlistsRef = db.ref('/playlists')

// Add description to game meta

// playlistsRef
//   .once('value')
//   .then(snap => snap.val())
//   .then(playlists =>
//     Promise.all(
//       mapValues((playlist, key) => {
//         const { sequence } = playlist
//         return playlistsRef
//           .child(key)
//           .child('sequence')
//           .set(null)
//           .then(() =>
//             sequence.map((gameRef, i) =>
//               playlistsRef
//                 .child(key)
//                 .child('sequence')
//                 .push({ gameRef, order: i })
//             )
//           )
//       }, playlists)
//     )
//   )
//   .then(() => console.log('done fixing playlist sequences'))
//   .catch(console.error)

instancesRef
  .once('value')
  .then(snap => snap.val())
  .then(instances =>
    Promise.all(
      mapValues((instance, key) => {
        const { savedChallenges = {}, playlist } = instance
        if (playlist) {
          return playlistsRef
            .child(playlist)
            .once('value')
            .then(snap => snap.val())
            .then(({ sequence }) =>
              instancesRef
                .child(key)
                .child('savedChallenges')
                .set(
                  map(
                    (val, sequenceKey) =>
                      savedChallenges[val.gameRef] ||
                      savedChallenges[sequenceKey] ||
                      `${key}${sequenceKey}`,
                    sequence || {}
                  )
                )
            )
            .then(() =>
              instancesRef
                .child(key)
                .child('testRun')
                .set(null)
            )
        }
        return Promise.resolve()
      }, instances)
    )
  )
  .then(() => console.log('done'))
