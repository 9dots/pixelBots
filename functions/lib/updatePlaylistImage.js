const {playlistImage} = require('../utils/createImage')
const addToFirebase = require('../utils/addToFirebase')
const {download, upload} = require('../utils/storage')
const functions = require('firebase-functions')
const {union, assignIn} = require('lodash')
const mapValues = require('@f/map-values')
const admin = require('firebase-admin')
const fs = require('node-fs-extra')
const Promise = require('bluebird')
const isArray = require('@f/is-array')

const playlistsRef = admin.database().ref('/playlists')

function promiseState (p) {
  return p.then((val) => ({state: 'resolved', val}))
					.catch((e) => ({state: 'rejected', val: e}))
}


module.exports = functions.database.ref('/playlists/{playlist}/sequence')
	.onWrite(evt => {
		const {playlist} = evt.params
    fs.mkdirsSync(`/tmp/${playlist}`)
  	return admin.database().ref(`/playlists/${playlist}/sequence`)
	    .limitToLast(4)
	    .once('value')
	    .then((res) => mapValues((val) => val, res.val() || {}).filter((el) => !!el))
	    .then((challenges) => {
	    	if (!challenges) {
	    		return failed('no sequence')
	    	}
	      const promises = mapValues((ref) => download(playlist, `${ref}.png`), challenges).map(promiseState)
	      return Promise.all(promises).filter((p) => p.state === 'resolved').map((p) => p.val)
	      	.then((results) => playlistImage(playlist, results))
	      	.then((img) => upload(img, playlist))
	      	.then((url) => addToFirebase(`/playlists/${playlist}/imageUrl`, url))
	      	.then(success)
	      	.catch(failed)
	    })

    function success (img) {
    	fs.remove(`/tmp/${playlist}`)
  	}

    function failed (e) {
      fs.remove(`/tmp/${playlist}`)
    }
	})
