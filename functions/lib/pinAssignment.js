/**
 * Imports
 */

const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const admin = require('firebase-admin')

/**
 * Retrieve and return a login token
 */

const classesRef = admin.database().ref('/classes')
const playlistByUserRef = admin.database().ref('/playlistsByUser')
const instancesRef = admin.database().ref('/playlistInstances')

module.exports = (req, res) => {
  const { groupId, playlistRef, pinned = false, keepAlive } = req.body
  if (keepAlive) {
    return res.status(200).send({ status: 'success', payload: 'ok' })
  }

  classesRef
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
            .then(val => pin(val, studentRef, pinned))
        )
      )
        .then(() => res.status(200).send({ status: 'success' }))
        .catch(e => res.status(500).send({ status: 'failed' }))
    )
}

function pin (inst, uid, pinned) {
  if (inst) {
    const obj = { pinned: !pinned }
    if (!pinned) {
      obj.lastEdited = Date.now()
    }

    return instancesRef.child(inst.instanceRef).update(obj)
  } else {
    return Promise.resolve()
  }
}
