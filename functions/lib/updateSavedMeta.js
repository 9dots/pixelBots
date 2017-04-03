const functions = require('firebase-functions')
const getLoc = require('../utils/getLoc')
const objEqual = require('@f/equal-obj')
const admin = require('firebase-admin')
const filter = require('@f/filter')
const pick = require('@f/pick')

const usersRef = admin.database().ref('/users')
const paintAttrs = [
  'initialPainted',
  'targetPainted',
  'painted',
]
const metaAttrs = [
  'firstShared',
  'animatedGif',
  'creatorID',
  'imageUrl',
  'attempts',
  'username',
  'likedBy',
  'title',
  'likes'
]

metaAttrs.forEach((attr) => {
  exports[attr] = updateSaveMeta(attr)
})

paintAttrs.forEach((attr) => {
  exports[attr] = filterGamePaint(attr)
})

exports.savedLinesOfCode = functions.database
  .ref('/saved/{saveRef}/animals/{animalID}/sequence')
  .onWrite(evt => {
    return new Promise((resolve, reject) => {
      if (!evt.data.exists() || objEqual(evt.data.val() || {}, evt.data.previous.val() || {})) {
        return resolve()
      }
      const sequence = evt.data.val()
      const promises = [
        updateProfileGame(evt.params.saveRef),
        evt.data.ref.parent.parent.parent.child('meta').update({
          loc: getLoc(sequence),
          lastEdited: Date.now()
        })
      ]
      Promise.all(promises)
        .then(resolve)
        .catch(reject)
    })
  })

function filterGamePaint (attr) {
  return functions.database.ref(`/saved/{saveRef}/${attr}`)
    .onWrite(evt => {
      return new Promise((resolve, reject) => {
        const {saveRef} = evt.params
        if (!evt.data.exists() || objEqual(evt.data.val() || {}, evt.data.previous.val() || {})) {
          return resolve()
        }
        evt.data.ref.parent.update({[attr]: filterPaint(evt.data.val())})
          .then(resolve)
          .catch(reject)
      })
    })
}

function updateSaveMeta (attr) {
  return functions.database.ref(`/saved/{saveRef}/${attr}`)
    .onWrite(evt => {
      return new Promise((resolve, reject) => {
        const {saveRef} = evt.params
        const data = evt.data.val()
        if (objEqual(data || {}, evt.data.previous.val() || {})) {
          return resolve()
        }
        const promises = [
          evt.data.ref.parent.child('meta').update({
            [attr]: evt.data.val(),
            lastEdited: Date.now()
          }),
          updateProfileGame(saveRef)
        ]
        Promise.all(promises)
          .then(resolve)
          .catch(reject)
      })
    })
}

function updateProfileGame (saveRef) {
  return new Promise((resolve, reject) => {
    const saveR = admin.database().ref('/saved').child(saveRef)
    const usersRef = admin.database().ref('/users')
    const parentDataPromises = [
      saveR.child('creatorID').once('value'),
      saveR.child('gameRef').once('value')
    ]
    Promise.all(parentDataPromises)
      .then((snaps) => snaps.map((s) => s.val()))
      .then(([creatorID, gameRef]) => usersRef.child(creatorID)
        .child('inProgress').child(gameRef).once('value')
      )
      .then(snap => snap.exists() && snap.ref.update({lastEdited: Date.now()}))
      .then(resolve)
      .catch(reject)
  })
}

function spreadMeta (obj) {
  const newObj = {}
  for (let key in obj) {
    newObj['meta/' + key] = obj[key]
  }
  return newObj
}

function getAnimals (save) {
  if (typeof (save.animals) === 'object') {
    return save.animals.map((animal) => animal.type)
  }
  return null
}

function getMeta (save) {
  return Object.assign({}, pick(metaAttrs, save), {animals: getAnimals(save), loc: getLocs(save.code, save.animals)})
}

function getLocs (code, animals = []) {
  if (!animals || animals.length < 1) return 0
  return animals.reduce((total, animal) => animal.sequence ? total + getLoc(animal.sequence) : 0, 0)
}

function filterPaint (obj) {
  if (typeof (obj) === 'object') {
    return filter(filterWhite, obj)
  }
  return obj ? obj : null
}

function filterWhite (square) {
  return square !== 'white'
}
