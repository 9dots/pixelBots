const functions = require('firebase-functions')
const admin = require('firebase-admin')
const pick = require('@f/pick')

const metaAttrs = [
  'inputType',
  'description',
  'type',
  'lastEdited',
  'title',
  'imageUrl',
  'creatorID',
  'stretch'
]

module.exports = functions.database.ref('/games/{gameRef}').onWrite(evt => {
  return new Promise((resolve, reject) => {
    const data = evt.data.val()
    if (!data) {
      return resolve()
    }
    const meta = pick(metaAttrs, data)
    evt.data.ref
      .child('meta')
      .update(meta)
      .then(resolve)
      .catch(reject)
  })
})
