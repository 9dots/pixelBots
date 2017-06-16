const functions = require('firebase-functions')
const admin = require('firebase-admin')

const playlistRef = admin.database().ref('/playlistsByUser')

module.exports = functions.database.ref('/playlistInstances/{instanceRef}')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const {completed, uid, playlist} = evt.data.val()
      const {instanceRef} = evt.params
      console.log(completed, instanceRef)
      const childRef = completed ? 'completed' : 'inProgress'
      playlistRef.child(uid).child(childRef).update({
        [instanceRef]: {
          lastEdited: Date.now(),
          playlistRef: playlist
        }
      })
        .then(() => playlistRef.child(uid).child('byPlaylistRef').update({
          [playlist]: {
            lastEdited: Date.now(),
            instanceRef
          }
        }))
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
