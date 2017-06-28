const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
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
          type: game.type || ''
        })
    ), games)
  ))
  .then(() => console.log('done adding description to meta'))
  .catch(console.error)
