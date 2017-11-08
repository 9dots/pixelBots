const createCode = require('../utils/createShortCode')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')

const playlistsRef = admin.database().ref('/playlists')
const gamesRef = admin.database().ref('/games')
const linksRef = admin.database().ref('/links')

module.exports = (req, res) => {
  res.set({ 'Cache-Control': 'no-cache' })
  const { creatorID, playlistRef, creatorUsername } = req.body
  return playlistsRef
    .child(playlistRef)
    .once('value')
    .then(snap => Promise.all([Promise.resolve(snap.val()), createCode()]))
    .then(([playlist, code]) => {
      return Promise.all(
        mapValues(
          ({ gameRef }) => gamesRef.child(gameRef).once('value'),
          playlist.sequence || {}
        )
      )
        .then(snaps => snaps.map(snap => snap.val()))
        .then(games => Promise.all(games.map(game => gamesRef.push(game))))
        .then(snaps => snaps.map(s => s.key))
        .then(keys =>
          playlistsRef.push(
            Object.assign({}, playlist, {
              sequence: keys.map((gameRef, i) => ({ gameRef, order: i })),
              shortLink: code,
              creatorID,
              creatorUsername,
              lastEdited: Date.now(),
              followedBy: { [creatorUsername]: true }
            })
          )
        )
        .then(({ key }) =>
          linksRef
            .child(code)
            .set({
              type: 'playlist',
              payload: key
            })
            .then(() => key)
        )
    })
    .then(({ key }) =>
      res.status(200).send({ status: 'success', playlistKey: key })
    )
    .catch(e => {
      console.error('error', e)
      return res.status(200).send({ status: 'failed', error: e })
    })
}
