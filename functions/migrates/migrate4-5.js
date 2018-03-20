const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const gamesRef = db.ref('/games')
const savesRef = db.ref('/saved')

// Add description to game meta

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(
    mapValues((game, key) => (
      game.inputType === 'icons'
        ? gamesRef
          .child(key)
          .child('animals')
          .child('0')
          .child('sequence')
          .set(updateBlockIds(game.animals[0].sequence || []))
        : Promise.resolve()
    ), games)
  ))
  .then(() => console.log('done adding description to meta'))
  .catch(console.error)


savesRef.once('value')
  .then(snap => snap.val())
  .then(saved => Promise.all(
    mapValues((save, key) => (
      save.animals && save.animals[0] && save.animals[0].sequence
        ? savesRef
          .child(key)
          .child('animals')
          .child('0')
          .child('sequence')
          .set(updateBlockIds(save.animals[0].sequence || []))
        : Promise.resolve()
    ), saved)
  ))
  .then(() => console.log('done fixing saved'))
  .catch(console.error)

function updateBlockIds (code = []) {
  if (!Array.isArray(code)) return code
  return code.map((block, i) => typeof block === 'object'
    ? Object.assign({}, block, {id: `${Date.now()}.${i}`})
    : block
  )
}