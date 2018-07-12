const toRegexp = require('path-to-regexp')
const orderBy = require('lodash/orderBy')
const admin = require('firebase-admin')
const map = require('@f/map')
const url = require('url')

const db = admin.database()

const playlistRef = db.ref('/playlists')
const gamesRef = db.ref('/games')
const linksRef = db.ref('/links')

const path2Re = toRegexp('/playlist/:id/:mode')
const path1Re = toRegexp('/playlist/:id')
const gameRe = toRegexp('/game/:id')
const activityRe = toRegexp('/activity/:id/:index')

const origin = 'https://v1.pixelbots.io'
const unfurls = ['playlist', 'game']

module.exports = (req, res) => {
  const { taskUrl } = req.body
  return parseTaskUrl(taskUrl)
    .then(unfurl)
    .then(data => res.send({ ok: true, tasks: formatTasks(data) }))
    .catch(e => res.send({ ok: false, error: e }))
}

function formatTasks (data) {
  return [].concat(data).map(task =>
    Object.assign({}, task, {
      type: 'practice',
      url: url.resolve(origin, task.url)
    })
  )
}

function parseTaskUrl (task) {
  return new Promise((resolve, reject) => {
    try {
      return resolve(url.parse(task).pathname)
    } catch (e) {
      return reject(e)
    }
  })
}

function unfurl (url) {
  if (gameRe.test(url)) {
    return unfurlGame(url)
  } else if (path1Re.test(url) || path2Re.test(url)) {
    return unfurlPlaylist(url)
  } else if (activityRe.test(url)) {
    return unfurlActivity(url)
  } else {
    return unfurlShareLink(url)
  }
}

function unfurlShareLink (url) {
  return linksRef
    .child(url)
    .once('value')
    .then(snap => snap.val())
    .then(data => {
      if (unfurls.includes(data.type)) {
        return unfurl(`/${data.type}/${data.payload}`)
      }
      throw new Error('not_found')
    })
}

function unfurlActivity (url) {
  const [, id, index] = activityRe.exec(url)
  return getPlaylistSequence(id).then(sequence => {
    if (!sequence[index]) throw new Error('not_found')
    const gameRef = sequence[index].gameRef
    return unfurlGame(`/game/${gameRef}`)
  })
}

function unfurlGame (url) {
  const [, id] = gameRe.exec(url)
  return gamesRef
    .child(id)
    .once('value')
    .then(snap => snap.val())
    .then(data => ({
      displayName: data.title,
      imageUrl: data.imageUrl,
      url: `/game/${id}`
    }))
}

function unfurlPlaylist (url) {
  const [, id] = path1Re.test(url) ? path1Re.exec(url) : path2Re.exec(url)
  return getPlaylistSequence(id).then(sequence =>
    Promise.all(sequence.map(({ gameRef }) => unfurlGame(`/game/${gameRef}`)))
  )
}

function getPlaylistSequence (id) {
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
