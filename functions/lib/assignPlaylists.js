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

const classesRef = admin.database().ref('/classes')
const instancesRef = admin.database().ref('/playlistInstances')
const playlistByUserRef = admin.database().ref('/playlistsByUser')

/**
 * Assign playlist to students in class
 */

module.exports = functions.database.ref('/feed/{groupId}/{assignmentRef}').onWrite(evt => {
  const data = evt.data.val()
  const {groupId} = evt.params
  const {playlistRef} = data

  return classesRef
    .child(groupId)
    .once('value')
    .then(snap => snap.val())
    .then(({students = {}}) => Promise.all(
      Object
        .keys(students)
        .map(studentRef => playlistByUserRef
          .child(studentRef)
          .child('byPlaylistRef')
          .child(playlistRef)
          .once('value')
          .then(snap => snap.val())
          .then(val => assignOrBump(val, playlistRef, studentRef))
        )
    ))
})

function assignOrBump (inst, playlist, uid) {
  if (inst) {
    return playlistByUserRef
      .child(uid)
      .child('byPlaylistRef')
      .child(playlist)
      .child('lastEdited')
      .set(Date.now())
      .child('assigned')
      .set(true)
  } else {
    return instancesRef
      .push({
        completedChallenges: [],
        lastEdited: Date.now(),
        savedChallenges: null,
        playlist,
        current: 0,
        uid,
        assigned: true
      })
      .then(({key}) => playlistByUserRef
        .child(uid)
        .child('byPlaylistRef')
        .child(playlist)
        .set({
          lastEdited: Date.now(),
          instanceRef: key,
          assigned: true
        })
      )
  }
}
