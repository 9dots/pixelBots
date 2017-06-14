/**
 * Imports
 */

const functions = require('firebase-functions')
const toRegexp = require('path-to-regexp')
const admin = require('firebase-admin')
const fetch = require('node-fetch')

/**
 * Path regex
 */

const pathRe = toRegexp('/playlist/:id')
const domain = functions.config().firebase.authDomain

/**
 * Retrieve and return a playlist
 */

module.exports = functions.https.onRequest((req, res) => {
  const type = req.get('accept')

  if (type === 'application/json') {
    const [, id] = pathRe.exec(req.url)

    return admin
      .database()
      .ref(`/playlists/${id}`)
      .once('value')
      .then(snap => snap.val())
      .then(populatePlaylist)
      .then(transformPlaylist)
      .then(playlist => res.send(playlist))
  } else {
    return fetch(`https://${domain}`)
      .then(res => res.text())
      .then(html => {
        res.header('text/html')
        res.send(html)
      })
      .catch(err => res.send(500, err))
  }
})

/**
 * Helpers
 */

function populatePlaylist (playlist) {
  return playlist
}

function transformPlaylist (playlist) {
  return playlist
}
