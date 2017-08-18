/**
 * Imports
 */

const functions = require('firebase-functions')
const flatten = require('lodash/flattenDeep')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const pick = require('@f/pick')

/**
 * Refs
 */

const feedsRef = admin.database().ref('/feed')
const instancesRef = admin.database().ref('/playlistInstances')
const playlistByUserRef = admin.database().ref('/playlistsByUser')

/**
 * Assign playlist to students in class
 */

module.exports = functions.database.ref('/users/{userRef}/studentOf/{classRef}').onWrite(evt => {
  console.log('event happened')
  const data = evt.data.val()
  const {userRef, classRef} = evt.params

  if (data !== true) {
    return
  }

  return new Promise((resolve, reject) => {
    feedsRef
      .child(classRef)
      .limitToFirst(3)
      .on('child_added', snap => snap.val().then(item => console.log('item', item)))
  })
})

function assign (playlist, uid) {
  return instancesRef
    .push({
      completedChallenges: [],
      lastEdited: Date.now(),
      savedChallenges: null,
      playlist,
      current: 0,
      uid
    })
    .then(({key}) => playlistByUserRef
      .child(uid)
      .child('byPlaylistRef')
      .child(playlist)
      .set({
        lastEdited: Date.now(),
        instanceRef: key
      })
    )
}
