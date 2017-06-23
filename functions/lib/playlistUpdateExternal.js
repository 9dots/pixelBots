/**
 * Imports
 */

const functions = require('firebase-functions')
const fetch = require('isomorphic-fetch')

/**
 * playlistUpdateExternal
 *
 * Update external apis on a user's progress thorugh a playlist
 */

module.exports = functions.database
  .ref('/playlistInstances/{instRef}/completedChallenges')
  .onWrite(evt => {
    const completed = evt.data.val() || []

    return evt.data.ref.parent.once('value')
      .then(snap => snap.val())
      .then(playlist => {
        const {update} = playlist
        console.log('playlistUpdateExternal', playlist, update)

        if (update) {
          return fetch(update, {
            method: 'POST',
            body: completed.reduce((acc, id) => {
              acc[id] = true
              return acc
            }, {})
          })
        }
      })
  })
