/**
 * Imports
 */

const {colors, blackAndWhite} = require('./utils/palette')
const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const extend = require('@f/extend')
const reduce = require('@f/reduce')

/**
 * Initialize db connection
 */

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()

/**
 * Migrate game.capabilities.paint[0] -> game.palette
 */

const gamesRef = db.ref('/games')

gamesRef.once('value')
  .then(snap => snap.val())
  .then(games => Promise.all(mapValues((game, key) => game.animals && gamesRef.child(key).update(migrateGame(game, key)), games)))
  .then(() => console.log('done migrating game.capabilities.paint -> game.palette'))
  .catch(console.warn)

function migrateGame (game, key) {
  if (game.palette) return {}

  const {capabilities = {}} = game
  const {paint = []} = capabilities
  const palette = paint[0]
    ? paint[0]
    : colors

  return {
    palette,
    capabilities: extend({}, capabilities, {paint: [true]})
  }
}
