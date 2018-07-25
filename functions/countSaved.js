const admin = require('firebase-admin')
const serviceAccount = require('./service.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-26016.firebaseio.com'
})

let classCodesRef = admin.database().ref('/feed')

classCodesRef
  .once('value')
  .then(snap => {
    let count = 0
    snap.forEach(s => {
      count += s.numChildren()
    })
    return count
  })
  .then(console.log)
  .catch(console.error)

// let count = 0
// const savedRef = admin.database().ref('/saved')

// retrieveChunk(1501545600)
//   .then(() => console.log('count', count))
//   .catch(console.error)

// async function retrieveChunk (startAt) {
//   return savedRef
//     .orderByChild('lastEdited')
//     .startAt(startAt)
//     .limitToFirst(1000)
//     .once('value')
//     .then(snap => {
//       if (snap.hasChildren) {
//         const childCount = snap.numChildren()
//         const lastKey = Object.keys(snap.val())[childCount - 1]
//         count += childCount
//         const last = snap.child(lastKey).val()
//         console.log(last.lastEdited)
//         return retrieveChunk(last.lastEdited)
//       }
//     })
// }
