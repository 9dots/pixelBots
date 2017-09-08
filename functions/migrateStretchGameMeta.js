const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const db = admin.database()
const gamesRef = db.ref('/games')
const savedRef = db.ref('/saved')

Add stretch to game meta

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(
    mapValues((game, key) => (
      gamesRef
        .child(key)
        .child('meta')
        .update({
          stretch: game.stretch || null
        })
    ), games)
  ))
  .then(() => console.log('done adding stretch to meta'))
  .catch(console.error)

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(
    mapValues((game, key) => {
      if (game.type === 'read' && !game.stretch) {
        return gamesRef
          .child(key)
          .update({
            stretch: {
              indicator: 'invalidCount',
              label: 'Errors',
              type: 'errorLimit'
            }
          })
      }
      return Promise.resolve()
    }, games)
  ))
  .then(() => console.log('done adding stretch to errors'))
  .catch(console.error)

savedRef.once('value')
  .then(snap => snap.val())
  .then(saved => Promise.all(
    mapValues((save, key) => (
      savedRef
        .child(key)
        .child('meta')
        .update({
          badges: save.badges || null
        })
    ), saved)
  ))
  .then(() => console.log('done adding badges to meta'))
  .catch(console.error)
