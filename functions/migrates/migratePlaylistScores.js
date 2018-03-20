const serviceAccount = require('./service.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const reduce = require('@f/reduce')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

const db = admin.database()
const instancesRef = db.ref('/playlistInstances')
const savedRef = db.ref('/saved')
const gamesRef = db.ref('/games')

instancesRef
  .once('value')
  .then(snap => snap.val())
  .then(instances =>
    Promise.all(
      mapValues((instance, key) => {
        const { savedChallenges = {}, completedChallenges = [] } = instance
        return getSavedBadges(savedChallenges || {})
          .then(badges =>
            completedChallenges.reduce(
              (acc, val) =>
                Object.assign({}, acc, {
                  [val]: { completed: 1, badge: badges[val] || 0 }
                }),
              {}
            )
          )
          .then(challengeScores =>
            instancesRef
              .child(key)
              .child('challengeScores')
              .set(challengeScores)
          )
      }, instances)
    )
  )
  .then(() => console.log('done'))
  .catch(console.error)

function getSavedBadges (challenges) {
  return Promise.all(
    mapValues(
      challenge =>
        savedRef
          .child(challenge)
          .once('value')
          .then(snap => snap.val() || {})
          .then(({ meta = {}, gameRef }) =>
            gamesRef
              .child(gameRef)
              .child('stretch')
              .once('value')
              .then(snap => snap.val())
              .then(stretch => [stretch, meta, gameRef])
          )
          .then(([stretch, meta, gameRef]) => [
            gameRef,
            reduce((acc, val, key) => acc + val, 0, meta.badges || {})
          ]),
      challenges
    )
  )
    .then(val => val.filter(v => !!v[0]))
    .then(vals =>
      reduce(
        (acc, val) => Object.assign({}, acc, { [val[0]]: val[1] }),
        {},
        vals
      )
    )
}
