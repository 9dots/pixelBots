/**
 * Imports
 */

const functions = require('firebase-functions')
const fetch = require('isomorphic-fetch')
const admin = require('firebase-admin')

/**
 * Constants
 */

const playlistsRef = admin.database().ref('/playlists')

/**
 * playlistUpdateExternal
 *
 * Update external apis on a user's progress thorugh a playlist
 */

module.exports = functions.database
  .ref('/playlistInstances/{instRef}/completedChallenges')
  .onWrite(evt => {
    const completed = evt.data.val() || []
    const {instRef} = evt.params

    return evt.data.ref.parent.once('value')
      .then(snap => snap.val())
      .then(playlistInstance => {
        const {id, playlist: playlistRef, update} = playlistInstance

        return playlistsRef
          .child(playlistRef)
          .once('value')
          .then(snap => snap.val())
          .then(playlist => {
            const {sequence = []} = playlist
            const body = completed.reduce((acc, id) => {
              const idx = sequence.indexOf(id)

              acc[id] = {
                complete: true,
                url: `/playlist/${playlistRef}/play/${instRef}/play/${idx}/results`
              }
              return acc
            }, {})

            console.log('playlistUpdateExternal', completed, playlist, update, body)

            if (update) {
              return fetch(update, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(body)
              })
            }
          })
      })
  })
