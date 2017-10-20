/**
 * Imports
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')

/**
 * Refs
 */

const playlistByUserRef = admin.database().ref('/playlistsByUser')
const instancesRef = admin.database().ref('/playlistInstances')
const feedsRef = admin.database().ref('/feed')

/**
 * Assign playlist to students in class
 */

module.exports = functions.database
  .ref('/users/{userRef}/studentOf/{classRef}')
  .onWrite(evt => {
    const data = evt.data.val()
    const { userRef, classRef } = evt.params

    if (data !== true) {
      return
    }

    return feedsRef
      .child(classRef)
      .limitToFirst(3)
      .once('value')
      .then(snap => snap.val())
      .then((items = {}) =>
        Promise.all(
          Object.keys(items).map(key =>
            playlistByUserRef
              .child(userRef)
              .child('byPlaylistRef')
              .child(items[key].playlistRef)
              .once('value')
              .then(snap => snap.val())
              .then(val => assignOrBump(val, items[key].playlistRef, userRef))
          )
        )
      )
  })

function assignOrBump (inst, playlist, uid) {
  if (inst) {
    return instancesRef.child(inst.instanceRef).update({
      lastEdited: Date.now(),
      assigned: true
    })
  } else {
    return instancesRef.push({
      completedChallenges: [],
      lastEdited: Date.now(),
      savedChallenges: null,
      playlist,
      current: 0,
      uid,
      assigned: true
    })
  }
}
