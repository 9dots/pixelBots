const serviceAccount = require('./serviceAccount.json')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const reduce = require('@f/reduce')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const db = admin.database()
const instancesRef = db.ref('/playlistInstances')
const savedRef = db.ref('/saved')

const instances = [
  {
    assigned: true,
    challengeScores: {
      '-KrH0PB1h9a_mtGy1aiw': 1
    },
    completedChallenges: ['-KrH0PB1h9a_mtGy1aiw'],
    current: 0,
    lastEdited: 1508525684346,
    pinned: false,
    playlist: '-Kr1cRvdFho9HTGEqBin',
    savedChallenges: {
      '-KwqulCpfxQaLMBj_yZY': '-KwHSjicV8dPlM1ujl99-KwqulCpfxQaLMBj_yZY',
      '-KwqulCpfxQaLMBj_yZZ': '-KwHSjicV8dPlM1ujl99-KwqulCpfxQaLMBj_yZZ',
      '-KwqulCpfxQaLMBj_yZ_': '-KwHSjicV8dPlM1ujl99-KwqulCpfxQaLMBj_yZ_',
      '-KwqulCpfxQaLMBj_yZa': '-KwHSjicV8dPlM1ujl99-KwqulCpfxQaLMBj_yZa',
      '-KwqulCqMggeTQE7L7VM': '-KwHSjicV8dPlM1ujl99-KwqulCqMggeTQE7L7VM',
      '-KwqulCqMggeTQE7L7VN': '-KwHSjicV8dPlM1ujl99-KwqulCqMggeTQE7L7VN',
      '-KwqulCqMggeTQE7L7VO': '-KwHSjicV8dPlM1ujl99-KwqulCqMggeTQE7L7VO',
      '-KwqulCqMggeTQE7L7VP': '-KwHSjicV8dPlM1ujl99-KwqulCqMggeTQE7L7VP'
    },
    uid: 'b1V2uAmlCieLOdP749PkdhGxfUw2'
  }
]

getSavedBadges(instances[0].savedChallenges)
  .then(console.log)
  .catch(console.error)

// instancesRef
//   .once('value')
//   .then(snap => snap.val())
//   .then(instances =>
//     Promise.all(
//       mapValues((instance, key) => {
//         const {challengeScores = {}, savedChallenges = {}} = instance
//         return getSavedChallenges(savedChallenges || {})
//           .then(saved => )

//       }, instances)
//     )
//   )

function getSavedBadges (challenges) {
  return Promise.all(
    mapValues(challenge => {
      return savedRef
        .child(challenge)
        .child('meta')
        .once('value')
        .then(snap => snap.val() || {})
        .then(meta => reduce((acc, val, key) => acc + 1, 0, meta.badges || {}))
    }, challenges)
  )
}
