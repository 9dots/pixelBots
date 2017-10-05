const functions = require('firebase-functions')
const getLoc = require('../utils/getLoc')
const objEqual = require('@f/equal-obj')
const admin = require('firebase-admin')
const filter = require('@f/filter')

const paintAttrs = ['initialPainted', 'targetPainted', 'painted']
const metaAttrs = [
  'firstShared',
  'animatedGif',
  'creatorID',
  'imageUrl',
  'attempts',
  'username',
  'badges',
  'likedBy',
  'title'
]

metaAttrs.forEach(attr => {
  exports[attr] = updateSaveMeta(attr)
})

paintAttrs.forEach(attr => {
  exports[attr] = filterGamePaint(attr)
})

function filterGamePaint (attr) {
  return functions.database.ref(`/saved/{saveRef}/${attr}`).onWrite(evt => {
    return new Promise((resolve, reject) => {
      if (
        !evt.data.exists() ||
        objEqual(evt.data.val() || {}, evt.data.previous.val() || {})
      ) {
        return resolve()
      }
      evt.data.ref.parent
        .update({ [attr]: filterPaint(evt.data.val()) })
        .then(resolve)
        .catch(reject)
    })
  })
}

function updateSaveMeta (attr) {
  return functions.database.ref(`/saved/{saveRef}/${attr}`).onWrite(evt => {
    return new Promise((resolve, reject) => {
      const { saveRef } = evt.params
      const data = evt.data.val()
      if (objEqual(data || {}, evt.data.previous.val() || {})) {
        return resolve()
      }
      const promises = [
        evt.data.ref.parent.child('meta').update({
          [attr]: evt.data.val(),
          lastEdited: Date.now()
        })
      ]
      Promise.all(promises)
        .then(resolve)
        .catch(reject)
    })
  })
}

function filterPaint (obj) {
  if (typeof obj === 'object') {
    return filter(filterWhite, obj)
  }
  return obj || null
}

function filterWhite (square) {
  return square !== 'white'
}
