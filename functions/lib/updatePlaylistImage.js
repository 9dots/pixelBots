const { playlistImage } = require('../utils/createImage')
const addToFirebase = require('../utils/addToFirebase')
const { download, upload } = require('../utils/storage')
const functions = require('firebase-functions')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const fs = require('node-fs-extra')
const Promise = require('bluebird')

function promiseState (p) {
  return p
    .then(val => ({ state: 'resolved', val }))
    .catch(e => ({ state: 'rejected', val: e }))
}

module.exports = functions.database
  .ref('/playlists/{playlist}/sequence')
  .onWrite(evt => {
    const { playlist } = evt.params
    fs.mkdirsSync(`/tmp/${playlist}`)
    return evt.data.ref.parent
      .child('imageVersion')
      .transaction(v => v + 1)
      .then(({ snapshot }) => snapshot.val())
      .then(imageVersion => {
        return admin
          .database()
          .ref(`/playlists/${playlist}/sequence`)
          .orderByChild('order')
          .limitToLast(4)
          .once('value')
          .then(res =>
            mapValues(val => val, res.val() || {}).filter(el => !!el)
          )
          .then(challenges => {
            if (!challenges) {
              return failed('no sequence')
            }
            const promises = mapValues(
              ({ gameRef }) => download(playlist, `${gameRef}.png`),
              challenges
            ).map(promiseState)
            return Promise.all(promises)
              .filter(p => p.state === 'resolved')
              .map(p => p.val)
              .then(results => playlistImage(playlist, results))
              .then(img => upload(img, playlist))
              .then(url =>
                addToFirebase(
                  `/playlists/${playlist}/imageUrl`,
                  `${url}&${imageVersion}`
                )
              )
              .then(success)
              .catch(failed)
          })
      })

    function success (img) {
      fs.remove(`/tmp/${playlist}`)
    }

    function failed (e) {
      fs.remove(`/tmp/${playlist}`)
    }
  })
