const toRegexp = require('path-to-regexp')
const admin = require('firebase-admin')
const url = require('url')

const db = admin.database()
const savedRef = db.ref('/saved')

const path1Re = toRegexp('/game/:id')
const origin = 'https://v1.pixelbots.io'

module.exports = (req, res) => {
  const { tasks } = req.body
  return Promise.all(tasks.map(getInstance))
    .then(instances => res.send({ ok: true, instances }))
    .catch(e => res.send({ ok: false, error: e }))
}

function getInstance ({ taskUrl, update }) {
  const task = url.parse(taskUrl).pathname
  const [, id] = path1Re.exec(task)
  return savedRef
    .push({ externalUpdate: update })
    .then(snap => snap.key)
    .then(instance => ({
      instance: formatRes(`/game/${id}/instance/${instance}`),
      id: update.id
    }))
}

function formatRes (instance) {
  return url.resolve(origin, instance)
}
