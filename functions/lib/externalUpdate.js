const fetch = require('isomorphic-fetch')
const admin = require('firebase-admin')
const { API_KEY } = require('../secrets')

const db = admin.database()
const savesRef = db.ref('/saved')

module.exports = (req, res) => {
  const { saveRef, progress = 100, completed = true } = req.body
  return savesRef
    .child(saveRef)
    .once('value')
    .then(snap => snap.val())
    .then(
      ({ externalUpdate }) =>
        externalUpdate || Promise.reject('no_external_update')
    )
    .then(({ host, id }) => {
      return fetch(host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Apikey ${API_KEY}`
        },
        body: JSON.stringify({ id, progress, completed })
      })
    })
    .then(res => (res.ok ? res.send({ ok: true }) : Promise.reject(res.error)))
    .catch(e => res.send({ ok: false, error: e }))
}
