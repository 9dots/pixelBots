const toRegexp = require('path-to-regexp')
const admin = require('firebase-admin')
const url = require('url')

const db = admin.database()
const savedRef = db.ref('/saved')

const path1Re = toRegexp('/game/:id')
const origin = 'https://v1.pixelbots.io'

module.exports = (req, res) => {
  const { taskUrl, update } = req.body
  const task = url.parse(taskUrl).pathname
  try {
    const [, id] = path1Re.exec(task)
    return savedRef
      .push({ externalUpdate: update })
      .then(snap => snap.key)
      .then(instance =>
        res.send({
          ok: true,
          instance: formatRes(`/game/${id}/instance/${instance}`)
        })
      )
      .catch(sendError)
  } catch (e) {
    console.error('error', e)
    return sendError('not_found')
  }

  function sendError (e) {
    return res.send({ ok: false, error: e })
  }
}

function formatRes (instance) {
  return url.resolve(origin, instance)
}
