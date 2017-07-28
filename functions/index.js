const functions = require('firebase-functions')
const admin = require('firebase-admin')
const forEach = require('@f/foreach')
const serviceAccount = require('./serviceAccount.json')

admin.initializeApp(Object.assign({}, functions.config().firebase, {
  credential: admin.credential.cert(serviceAccount)
}))

forEach((f, key) => exports[key] = f, require('./lib'))

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((req, res) => {
//   res.send('Hello from Firebase!')
// })

// exports.likedToMeta = functions.database.ref('/saved/{saveID}/likedBy')
// 	.onWrite(evt => {
// 	  return evt.data.ref.parent.child('meta').child('likedBy').set(evt.data.val())
// })
