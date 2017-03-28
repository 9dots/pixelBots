const injectToGame = require('../utils/addToFirebase')
const {levelThumb} = require('../utils/createImage')
const functions = require('firebase-functions')
const {upload} = require('../utils/storage')
const fs = require('node-fs-extra')

const removeTempFiles = (path) => fs.remove(path)

module.exports = functions.database.ref('/saved/{saveRef}/painted')
	.onWrite(evt => {
		return new Promise((resolve, reject) => {
			const {saveRef} = evt.params
			const painted = evt.data.val()
			evt.data.ref.parent.once('value')
				.then(snap => snap.val())
				.then(({levelSize}) => levelThumb(saveRef, levelSize[0], painted))
		    .then(res => upload(res, saveRef))
		    .then((res) => injectToGame(`/saved/${saveRef}/imageUrl`, res))
		    .then((res) => injectToGame(`/saved/${saveRef}/meta/imageUrl`, res))
		    .then(success)
		    .catch(failed)

		  function failed (e) {
		  	console.warn(e)
		    removeTempFiles(`/tmp/${saveRef}.png`)
		    resolve()
		  }

		  function success () {
		    removeTempFiles(`/tmp/${saveRef}.png`)
		    reject()
		  }
		})
	})
