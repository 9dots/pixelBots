import firebase from 'firebase'

const storageRef = firebase.storage().ref()

function * uploadImage (canvas, ref) {
	const file = canvas.toDataURL('image/png')
	const blob = dataURItoBlob(file)
	const imageRef = storageRef.child(`images/${ref}`)
	const snapshot = yield imageRef.put(blob, {contentType: 'image/png'})
}

function getImage (ref) {
	return storageRef.child(`images/${ref}`).getDownloadURL()
		.then((imageURL) => imageURL)
		.catch((e) => null)
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1])
  else
    byteString = unescape(dataURI.split(',')[1])

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], {type:mimeString})
}

export {
	getImage,
	uploadImage
}