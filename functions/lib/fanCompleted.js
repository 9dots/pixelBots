const functions = require('firebase-functions')
const admin = require('firebase-admin')

const playlistsRef = admin.database().ref('/playlistsByUser')

module.exports = functions.database.ref('/users/{uid}/stats/completedPlaylists')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const data = evt.data.val()
      const {uid} = evt.params
      playlistsRef.child(uid).child(completedCount).set(data)
    })
  })
