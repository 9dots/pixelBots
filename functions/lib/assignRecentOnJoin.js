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
  const data = evt.data.val()
  const {userRef, classRef} = evt.params

  if (data !== true) {
    return
  }

  return feedsRef
    .child(classRef)
    .limitToFirst(3)
    .once('value')
    .then(snap => snap.val())
    .then((items = {}) => Promise.all([
      Object
        .keys(items)
        .map(key => playlistByUserRef
          .child(userRef)
          .child('byPlaylistRef')
          .child(items[key].playlistRef)
          .once('value')
          .then(snap => snap.val())
          .then(val => assignOrBump(val, items[key].playlistRef, userRef))
        )
      ])
    )
})

function assignOrBump (inst, playlist, uid) {
  if (inst) {
    return playlistByUserRef
      .child(uid)
      .child('byPlaylistRef')
      .child(playlist)
      .child('lastEdited')
      .set(Date.now())
  } else {
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
}
