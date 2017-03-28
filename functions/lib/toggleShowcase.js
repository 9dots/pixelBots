const functions = require('firebase-functions')
const admin = require('firebase-admin')

const usernameRef = admin.database().ref('/usernames')
const usersRef = admin.database().ref('/users')
const savedRef = admin.database().ref('/saved')

module.exports = functions.database.ref('/saved/{saveRef}/meta/shared')
  .onWrite(evt => {
  	const saveRef = evt.params.saveRef
  	return evt.data.ref.parent.once('value')
  		.then(snap => snap.val())
  		.then(({username, gameRef}) => {
  			usernameRef.child(username).once('value')
  				.then(snap => snap.val())
  				.then(uid => evt.data.val()
  					? addToShowcase(saveRef, gameRef, uid)
  					: usersRef.child(uid).child('showcase').child(saveRef).remove()
  				)
  				.catch(e => console.warn(e))
  		})
  		.catch(e => console.warn(e))
  })


function addToShowcase (saveRef, gameRef, uid) {
	return usersRef.child(uid).child('showcase').child(saveRef).set({
			saveRef,
			gameRef
		}))
		.catch((e) => console.warn(e))
}