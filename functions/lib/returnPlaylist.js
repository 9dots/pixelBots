/**
 * Imports
 */

const functions = require('firebase-functions')
const toRegexp = require('path-to-regexp')
const admin = require('firebase-admin')
const extend = require('@f/extend')
const fetch = require('node-fetch')

/**
 * Path regex
 */

const path1Re = toRegexp('/playlist/:id')
const path2Re = toRegexp('/playlist/:id/view')
const domain = functions.config().firebase.authDomain

/**
 * Retrieve and return a playlist
 */

module.exports = functions.https.onRequest((req, res) => {
  const type = req.get('accept')

  if (type === 'application/json') {
    const [, id] = path1Re.test(req.url)
      ? path1Re.exec(req.url)
      : path2Re.exec(req.url)

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
  return Promise.all(
    playlist.sequence.map(id =>
      admin
        .database()
        .ref(`/games/${id}/meta`)
        .once('value')
        .then(snap => snap.val())
    )
  ).then(sequence => {
    return extend(playlist, {
      sequence: sequence.map((challenge, i) =>
        extend(challenge, {
          id: playlist.sequence[i]
        })
      )
    })
  })
}

function transformPlaylist (playlist) {
  return {
    objectType: 'assignment',
    author: playlist.creatorUsername,
    image: {
      url: playlist.imageUrl
    },
    description: playlist.description,
    displayName: playlist.name,
    attachments: playlist.sequence.map(transformChallenge)
  }
}

function transformChallenge (challenge) {
  return {
    objectType: 'assignment_item',
    guid: challenge.id,
    image: {
      url: challenge.imageUrl
    },
    displayName: challenge.title
  }
}
