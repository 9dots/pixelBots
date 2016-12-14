import firebase from 'firebase'
import createAction from '@f/create-action'
import {refMethod} from 'vdux-fire'
import {setUrl} from 'redux-effects-location'
import {refresh} from '../actions'
import sleep from '@f/sleep'

const setUserId = createAction('SET_USER_ID')
const setUsername = createAction('SET_USERNAME')
const setUserProfile = createAction('SET_USER_PROFILE')
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
				dispatch(setUrl('/'))
			}).catch(function(error) {
				if (error.code === 'auth/credential-already-in-use') {
					return firebase.auth().signInWithCredential(error.credential)
				}
			})
  	}
  	if (action.type === signOut.type) {
  		firebase.auth().signOut()
      dispatch(setUrl('/'))
      dispatch(refresh())
  	}
    if (action.type === setUserId.type && action.payload) {
      firebase.database().ref(`/users/${action.payload.uid}`).on('value', (snap) => dispatch(setUserProfile(snap.val())))
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
  try {
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
  } catch (e) {
    console.warn(e)
  }
}

function createName (user, ext) {
  if (user.providerData[0].email) {
    return user.providerData[0].email.split('@')[0].replace('.', '') + ext
  } else {
    return user.providerData[0].displayName.replace(' ', '')
  }
}

function * createUsername (user, ext = '', username = '') {
  username =  username || createName(user, ext)
  const snap = yield refMethod({
    ref: `/usernames/${username}`,
    updates: {
      method: 'once',
      value: 'value'
    }
  })
  if (snap.exists()) {
    yield createUsername(user, ext ? ++ext : 1, username)
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
  setUserProfile,
  setUsername,
	setUserId,
	signOut
}