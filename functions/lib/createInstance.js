const admin = require('firebase-admin')
const toRegexp = require('path-to-regexp')

const db = admin.database()

const instancesRef = db.ref('/playlistInstances')
const playlistRef = db.ref('/playlists')

const path1Re = toRegexp('/playlist/:id')
const path2Re = toRegexp('/playlist/:id/view')

module.exports = (req, res) => {
  const { playlistUrl } = req.body

  const [, id] = path1Re.test(playlistUrl)
    ? path1Re.exec(playlistUrl)
    : path2Re.exec(playlistUrl)

  instancesRef
    .push({
      completedChallenges: [],
      lastEdited: Date.now(),
      savedChallenges: null,
      started: false,
      assigned: true,
      playlist: id,
      current: 0
    })
    .then(snap => res.send({ url: `/activity/${id}/instance/${snap.key}` }))
}
