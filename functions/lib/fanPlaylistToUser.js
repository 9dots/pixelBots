const functions = require('firebase-functions')
const admin = require('firebase-admin')

const usersRef = admin.database().ref('/users')

module.exports = functions.database.ref('/playlists/{playlistRef}')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const data = evt.data.val()
      const {playlistRef} = evt.params
      const userRef = usersRef.child(data.creatorID)
      userRef.child('playlists').child(playlistRef)
        .update(Object.assign({}, data, {ref: playlistRef}))
        .then(resolve)
        .catch(reject)
    })
  })
