const functions = require('firebase-functions')
const flatten = require('lodash/flattenDeep')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const pick = require('@f/pick')

const usersRef = admin.database().ref('/users')
const usernamesRef = admin.database().ref('/usernames')

const profileProps = ['creatorID', 'creatorUsername', 'description', 'lastEdited', 'name']

module.exports = functions.database.ref('/playlists/{playlistRef}')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      const data = evt.data.val()
      const followedBy = data.followedBy
      const {playlistRef} = evt.params
      const usersIds = mapValues((u, key) => usernamesRef.child(key).once('value'), followedBy || {})
      Promise.all(usersIds)
        .then(snaps => flatten(snaps.map(s => s.val())))
        .then(ids => ids.map((id) => usersRef.child(id).child('playlists').child(playlistRef)
          .update(Object.assign({}, pick(profileProps, data), {ref: playlistRef}))
        ))
        .then(resolve)
        .catch(reject)
    })
  })
