const injectToGame = require('../utils/addToFirebase')
const {levelThumb} = require('../utils/createImage')
const functions = require('firebase-functions')
const {upload} = require('../utils/storage')
const fs = require('node-fs-extra')

const removeTempFiles = (path) => fs.removeSync(path)

const paths = [
  'games',
  'drafts'
]

paths.forEach(baseRef => {
  exports[baseRef] = createGameImage(baseRef)
})

function createGameImage (baseRef) {
  return functions.database.ref(`/${baseRef}/{gameRef}/targetPainted`)
		.onWrite(evt => {
		  return new Promise((resolve, reject) => {
		    const {gameRef} = evt.params
		    const targetPainted = evt.data.val()
		    evt.data.ref.parent.once('value')
					.then(snap => snap.val())
					.then(({levelSize}) => levelThumb(gameRef, levelSize[0], targetPainted))
					.then(res => upload(res, gameRef))
					.then((res) => injectToGame(`/${baseRef}/${gameRef}/imageUrl`, res))
					.then((res) => injectToGame(`/${baseRef}/${gameRef}/meta/imageUrl`, res))
					.then(success)
					.catch(failed)

		    function failed (e) {
		      console.warn(e)
		      removeTempFiles(`/tmp/${gameRef}.png`)
		      console.log('cleaned up')
		      resolve()
		    }

		    function success () {
		      removeTempFiles(`/tmp/${gameRef}.png`)
		      console.log('cleaned up')
		      reject()
		    }
		  })
		})
}
