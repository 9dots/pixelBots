const toRegexp = require('path-to-regexp')
const admin = require('firebase-admin')

const db = admin.database()
const savedRef = db.ref('/saved')

const path1Re = toRegexp('/game/:id')

module.exports = (req, res) => {
  const { taskUrl, update } = req.body
  try {
    const [, id] = path1Re.exec(taskUrl)
    return savedRef
      .push({ externalUpdate: update })
      .then(snap => snap.key)
      .then(instance =>
        res.send({ ok: true, instance: `/game/${id}/instance/${instance}` })
      )
      .catch(sendError)
  } catch (e) {
    console.error('error', e)
    return sendError('bad_url')
  }

  function sendError (e) {
    return res.send({ ok: false, error: e })
  }
}
