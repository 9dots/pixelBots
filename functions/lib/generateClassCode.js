const functions = require('firebase-functions')
const admin = require('firebase-admin')
const classes = admin.database().ref('/classes')
const Hashids = require('hashids')
const hashids = new Hashids(
  'Oranges --neverripen in the=winter_because this is the way that it i5',
  5,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
)

module.exports = functions.database.ref('/classes/{classRef}')
  .onWrite(evt => {
      const cls = evt.data.val()

      if (!cls.code) {
        return createCode().then(code => Promise.all([
          classes
            .child(evt.params.classRef)
            .update({
              code
            }),
          admin.database().ref('/class_codes/').update({
            [code]: evt.params.classRef
          })
        ]))
      }

      return Promise.resolve()
  })

const generateRands = () => [0, 1, 2, 3, 4].map(() => Math.round(Math.random() * 100000))

function generateID () {
  return hashids.encode(generateRands()).substr(0, 5)
}

function checkForExisting (ref, id) {
  return admin
    .database()
    .ref(ref)
    .orderByKey()
    .equalTo(id)
    .once('value')
    .then(snap => snap.val())
}

function createCode (ref = '/class_codes/') {
  const id = generateID()

  return checkForExisting(ref, id)
    .then(val => val ? createCode(ref) : id)
}
