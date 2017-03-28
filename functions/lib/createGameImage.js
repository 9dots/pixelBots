const injectToGame = require('../utils/addToFirebase')
const {levelThumb} = require('../utils/createImage')
const functions = require('firebase-functions')
const {upload} = require('../utils/storage')
const fs = require('node-fs-extra')

const removeTempFiles = (path) => fs.remove(path)

module.exports = functions.database.ref('/games/{gameRef}/targetPainted')
	.onWrite(evt => {
		return new Promise((resolve, reject) => {
			const {gameRef} = evt.params
			const targetPainted = evt.data.val()
			evt.data.ref.parent.once('value')
				.then(snap => snap.val())
				.then(({levelSize}) => levelThumb(gameRef, levelSize[0], targetPainted))
		    .then(res => upload(res, gameRef))
		    .then((res) => injectToGame(`/games/${gameRef}/imageUrl`, res))
		    .then((res) => injectToGame(`/games/${gameRef}/meta/imageUrl`, res))
		    .then(success)
		    .catch(failed)

		  function failed (e) {
		  	console.warn(e)
		    removeTempFiles(`/tmp/${gameRef}.png`)
		    resolve()
		  }

		  function success () {
		    removeTempFiles(`/tmp/${gameRef}.png`)
		    reject()
		  }
		})
	})
