const firebase = require('firebase')
const Hashids = require('hashids')

const hashids = new Hashids(
  'Oranges never ripen in the winter',
  5,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
)

function generateID () {
  return hashids.encode(Math.floor(Math.random() * 10000) + 1)
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
