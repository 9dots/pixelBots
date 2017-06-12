const functions = require('firebase-functions')
const admin = require('firebase-admin')

const playlistRef = admin.database().ref('/playlistsByUser')

module.exports = functions.database.ref('/playlistInstances/{instanceRef}')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const {completed, uid} = evt.data.val()
      const childRef = completed ? 'completed' : 'inProgress'
      playlistRef.child(uid).child(childRef).update({
        [instanceRef]: Date.now()
      })
        .then(() => {
          if (completed) {
            return playlistRef.child(uid).child('inProgress').update({
              [instanceRef]: null
            })
          } else return Promise.resolve()
        })
        .then(resolve)
        .catch(reject)
      })
  })
