const functions = require('firebase-functions')
const admin = require('firebase-admin')

const usersRef = admin.database().ref('/users')

module.exports = functions.database.ref('/games/{gameRef}/meta')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const data = evt.data.val()
      const {gameRef} = evt.params
      const userRef = usersRef.child(data.creatorID)
      userRef.child('games').child(gameRef)
        .update(Object.assign({}, data, {animal: data.animals[0], ref: gameRef}))
        .then(() => userRef.child('drafts').child(gameRef).remove())
        .then(resolve)
        .catch(reject)
    })
  })
