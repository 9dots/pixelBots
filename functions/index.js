var functions = require('firebase-functions')

// // Start writing Firebase Functions
// // https://firebase.google.com/preview/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello from Firebase!')
})

exports.likedToMeta = functions.database.ref('/saved/{saveID}/likedBy')
	.onWrite(evt => {
	  return evt.data.ref.parent.child('meta').child('likedBy').set(evt.data.val())
})
