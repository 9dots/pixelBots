import firebase from 'firebase'
import createAction from '@f/create-action'

const setUserId = createAction('SET_USER_ID')
const signInWithGoogle = createAction('SIGN_IN_WITH_GOOGLE')
const signOut = createAction('SIGN_OUT')

export default ({getState, dispatch}) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      return firebase.auth().signInAnonymously()
    }
    return dispatch(setUserId(user))
  })
  return (next) => (action) => {
  	if (action.type === signInWithGoogle.type) {
  		var provider = new firebase.auth.GoogleAuthProvider()
  		// firebase.auth().signInWithPopup(provider)
			firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
				console.log('accounts linked')
			}).catch(function(error) {
				if (error.code === 'auth/credential-already-in-use') {
					return firebase.auth().signInWithCredential(error.credential)
				}
			});
  	}
  	if (action.type === signOut.type) {
  		firebase.auth().signOut()
  	}
  	return next(action)
  }
}

export {
	signInWithGoogle,
	setUserId,
	signOut
}