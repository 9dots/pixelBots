const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const db = admin.database()
const playlistsRef = db.ref('/playlists')

// Add description to game meta

playlistsRef.once('value')
  .then(snap => snap.val())
  .then(playlists => )