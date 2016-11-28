import firebase from 'firebase'
import createAction from '@f/create-action'
import {refMethod} from 'vdux-fire'

const setUserId = createAction('SET_USER_ID')
const setUsername = createAction('SET_USERNAME')
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
    if (user && !user.isAnonymous) {
      dispatch(maybeCreateNewUser(user))
    }
    return dispatch(setUserId(user))
  })
  return (next) => (action) => {
  	if (action.type === signInWithProvider.type) {
  		var provider = providers[action.payload]()
			firebase.auth().signInWithPopup(provider).then(function(result) {
				console.log(result)
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

function * maybeCreateNewUser (user) {
  const maybeUser = yield checkUsers(user.uid)
  if (maybeUser.exists()) {
    return yield setUsername(maybeUser.val().username)
  }
  const username = yield createUsername(user)
  yield refMethod({
    ref: `/users/${user.uid}`,
    updates: {
      method: 'set',
      value: {
        username,
        displayName: user.displayName || user.providerData[0].displayName,
        photoURL: user.photoURL || user.providerData[0].photoURL
      }
    }
  })
}

function * createUsername (user, ext = '') {
  const username = user.providerData[0].email.split('@')[0] + ext
  const snap = yield refMethod({
    ref: `/usernames/${username}`,
    updates: {
      method: 'once',
      value: 'value'
    }
  })
  if (snap.exists()) {
    yield createUsername(user, ext ? ++ext : 1)
  } else {
    yield refMethod({
      ref: `/usernames/${username}`,
      updates: {
        method: 'set',
        value: user.uid
      }
    })
    yield setUsername(username)
    return username
  }
}

function * checkUsers (uid) {
  const snap = yield refMethod({
    ref: `/users/${uid}`,
    updates: {method: 'once', value: 'value'}
  })
  return snap
}

export {
	signInWithProvider,
  setUsername,
	setUserId,
	signOut
}