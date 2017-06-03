const functions = require('firebase-functions')
const admin = require('firebase-admin')
const pick = require('@f/pick')

const usersRef = admin.database().ref('/users')

module.exports = functions.database.ref('/drafts/{draftRef}')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const data = evt.data.val()
      const {draftRef} = evt.params
      const userRef = usersRef.child(data.creatorID)
      userRef.child('drafts').child(draftRef)
        .set(Date.now())
        .then(resolve)
        .catch(reject)
    })
  })
