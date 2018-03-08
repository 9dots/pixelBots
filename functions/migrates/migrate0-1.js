const {colors, blackAndWhite} = require('./utils/palette')
const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const animalDocs = require('./apiDocs')
const reduce = require('@f/reduce')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const usersRef = db.ref('/users')

// Delete drafts

const draftRef = db.ref('/drafts')
usersRef.once('value')
  .then(snap => snap.val())
  .then(users => Promise.all(mapValues((u, key) => usersRef.child(key).update({drafts: null}), users)))
  .then(() => console.log('delete user drafts'))
  .catch((e) => console.error('could not delete user drafts', e))
draftRef.set(null).then(() => console.log('delete drafts'))

// Save playlist by ref

usersRef.once('value')
  .then(snap => snap.val())
  .then(users => Promise.all(mapValues((u, key) => ({
    playlists: u.playlists,
    userRef: usersRef.child(key).child('playlists')
  }), users).filter(p => !!p.playlists).map(({playlists, userRef}) => mapValues((p, key) => {
    return p.ref && p.ref !== key
      ? Promise.all([userRef.child(p.ref).update(p), userRef.child(key).remove()])
      : Promise.resolve()
  }, playlists || {}))))
  .then(() => console.log('save playlist by ref done'))
  .catch(console.error)

// Add capabilities to games

const gamesRef = db.ref('/games')

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(mapValues((game, key) => game.animals && gamesRef.child(key).update({capabilities: getCapabilities(game.animals[0].type)}), games)))
  .then(() => console.log('done adding capabilities to games'))
  .catch(console.warn)

function getCapabilities (animal) {
  const api = Object.assign({}, animalDocs[animal], {'block_end': true})
  return reduce((acc, val, key) => {
    if (key === 'paint') {
      return Object.assign({}, acc, {paint: val.args ? [colors] : [blackAndWhite]})
    } else if (key === 'move') {
      return Object.assign({}, acc, {forward: true})
    } else if (key === 'if_color') {
      return Object.assign({}, acc, {ifColor: true})
    } else {
      return Object.assign({}, acc, {[key]: val.args ? [true] : true})
    }
  }, {}, api)
}

// Remove solutions

const solutionsRef = db.ref('/solutions')

solutionsRef.remove()
  .then(() => console.log('done remove solutions'))
  .catch(console.error)
