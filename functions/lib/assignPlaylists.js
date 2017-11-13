/**
 * Imports
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')

/**
 * Refs
 */

const classesRef = admin.database().ref('/classes')
const instancesRef = admin.database().ref('/playlistInstances')
const playlistByUserRef = admin.database().ref('/playlistsByUser')

/**
 * Assign playlist to students in class
 */

module.exports = functions.database
  .ref('/feed/{groupId}/{assignmentRef}')
  .onCreate(evt => {
    const data = evt.data.val()
    const { groupId } = evt.params
    const { playlistRef } = data || {}

    return classesRef
      .child(groupId)
      .once('value')
      .then(snap => snap.val())
      .then(({ students = {} }) =>
        Promise.all(
          Object.keys(students).map(studentRef =>
            playlistByUserRef
              .child(studentRef)
              .child('byPlaylistRef')
              .child(playlistRef)
              .once('value')
              .then(snap => snap.val())
              .then(val => assignOrBump(val, playlistRef, studentRef))
          )
        )
      )
      .then(() => console.log('done'))
  })

function assignOrBump (inst, playlist, uid) {
  console.log(inst, playlist, uid)
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
      started: false,
      playlist,
      current: 0,
      uid,
      assigned: true
    })
  }
}
