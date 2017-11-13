const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const playlistsRef = db.ref('/playlists')

// Add description to game meta

playlistsRef
  .once('value')
  .then(snap => snap.val())
  .then(playlists =>
    Promise.all(
      mapValues(
        (playlist, key) =>
          playlistsRef.child(key).update({
            sequence: (playlist.sequence || []).filter(game => !!game)
          }),
        playlists
      )
    )
  )
  .then(() => console.log('done fixing playlist sequences'))
  .catch(console.error)

// let count = 0

// const fs = require('fs')
// const path = require('path')
// const JSONStream = require('JSONStream')
// const es = require('event-stream')
// fs
//   .createReadStream(path.join(process.cwd(), 'restoreDb.json'))
//   .pipe(JSONStream.parse('playlistsByUser'))
//   .pipe(
//     es.mapSync(function (data) {
//       fs.writeFileSync('playlistsByUser.json', JSON.stringify(data))
//       return data
//     })
//   )
