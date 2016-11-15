import firebase from 'firebase'
import createAction from '@f/create-action'

const setUserId = createAction('SET_USER_ID')
const signInWithProvider = createAction('SIGN_IN_WITH_PROVIDER')
const signOut = createAction('SIGN_OUT')

const providers = {
  google: () => new firebase.auth.GoogleAuthProvider(),
  facebook: () => new firebase.auth.FacebookAuthProvider()
}



export default ({getState, dispatch}) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      dispatch(setUserId(null))
      return firebase.auth().signInAnonymously()
    }
    return dispatch(setUserId(user))
  })
  return (next) => (action) => {
  	if (action.type === signInWithProvider.type) {
  		var provider = providers[action.payload]()
			firebase.auth().signInWithPopup(provider).then(function(result) {
				console.log('signed in', result)
			}).catch(function(error) {
				if (error.code === 'auth/credential-already-in-use') {
					return firebase.auth().signInWithCredential(error.credential)
				}
			})
  	}
  	if (action.type === signOut.type) {
  		firebase.auth().signOut()
  	}
  	return next(action)
  }
}

export {
	signInWithProvider,
	setUserId,
	signOut
}