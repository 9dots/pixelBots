const admin = require('firebase-admin')
const toRegexp = require('path-to-regexp')
const orderBy = require('lodash/orderBy')
const map = require('@f/map')

const db = admin.database()

const playlistRef = db.ref('/playlists')
const gamesRef = db.ref('/games')

module.exports = (req, res) => {
  const { taskUrl } = req.body
  return unfurl(taskUrl)
    .then(data =>
      res.send({ ok: true, tasks: Array.isArray(data) ? data : [data] })
    )
    .catch(e => res.send({ ok: false, error: e }))
}

function unfurl (url) {
  return toRegexp('/game/:id').test(url) ? unfurlGame(url) : unfurlPlaylist(url)
}

function unfurlGame (url) {
  const [, id] = toRegexp('/game/:id').exec(url)
  return gamesRef
    .child(id)
    .once('value')
    .then(snap => snap.val())
    .then(data => ({
      displayName: data.title,
      imageUrl: data.imageUrl,
      url: `/games/${id}`
    }))
}

function unfurlPlaylist (url) {
  const path1Re = toRegexp('/playlist/:id')
  const path2Re = toRegexp('/playlist/:id/view')
  const [, id] = path1Re.test(url) ? path1Re.exec(url) : path2Re.exec(url)
  return getSaveRefs(id).then(sequence =>
    Promise.all(sequence.map(({ gameRef }) => unfurlGame(`/game/${gameRef}`)))
  )
}

function getSaveRefs (id) {
  return playlistRef
    .child(id)
    .once('value')
    .then(snap => snap.val())
    .then(({ sequence }) =>
      orderBy(
        map((val, key) => Object.assign({}, val, { key }), sequence),
        'order',
        'asc'
      )
    )
}
