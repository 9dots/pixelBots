const firebase = require('firebase')
const Hashids = require('hashids')

const hashids = new Hashids(
  'Oranges --neverripen in the=winter_because this is the way that it i5',
  5,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
)

const generateRands = () => [0, 1, 2, 3, 4].map(() => Math.round(Math.random() * 100000))

function generateID () {
  return hashids.encode(generateRands()).substr(0, 5)
}

function checkForExisting (ref, id) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(ref).orderByKey().equalTo(id).once('value')
      .then((snap) => resolve(snap.val()))
      .catch(reject)
  })
}

function createCode (ref = '/links') {
  return new Promise((resolve, reject) => {
    const id = generateID()
    checkForExisting(ref, id)
      .then((val) => val ? resolve(createCode(ref)) : resolve(id))
      .catch(reject)
  })
}

export default createCode
