const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const map = require('@f/map')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const instancesRef = db.ref('/playlistInstances')
const playlistsRef = db.ref('/playlists')

// migratePlaylistSequence()
updateSaves().catch(console.error)

// Add description to game meta

function migratePlaylistSequence () {
  return playlistsRef
    .once('value')
    .then(snap => snap.val())
    .then(playlists =>
      Promise.all(
        mapValues((playlist, key) => {
          const { sequence } = playlist
          if (Array.isArray(sequence)) {
            return playlistsRef
              .child(key)
              .child('sequence')
              .set(null)
              .then(() =>
                sequence.map((gameRef, i) =>
                  playlistsRef
                    .child(key)
                    .child('sequence')
                    .push({ gameRef, order: i })
                )
              )
          }
          return Promise.resolve()
        }, playlists)
      )
    )
    .then(() => console.log('done fixing playlist sequences'))
    .catch(console.error)
}

function updateSaves () {
  return instancesRef
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
              .then(snap => snap.val() || {})
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
}
