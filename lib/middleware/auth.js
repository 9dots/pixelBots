import firebaseConfig from 'client/firebaseConfig'
import {setItem} from 'redux-effects-localstorage'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {set as firebaseSet, once as firebaseOnce} from 'vdux-fire'
import firebase from 'firebase'

const setUserProfile = createAction('SET_USER_PROFILE')
const signInWithWeo = createAction('SIGN_IN_WITH_WEO')
const signInWithToken = createAction('SIGN_IN_WITH_TOKEN')

const auth = firebase.auth

const SIGN_OUT = 'Sign Out'
const SIGN_IN_WITH_PROVIDER = 'Sign In With Provider'

function signInWithProvider (provider) {
  return {
    type: SIGN_IN_WITH_PROVIDER,
    payload: provider
  }
}

function signOut () {
  return {
    type: SIGN_OUT
  }
}

const providers = {
  google: () => new auth.GoogleAuthProvider(),
  facebook: () => new auth.FacebookAuthProvider()
}

export default ({actions, dispatch}) => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
  window.addEventListener('message', ({data}) => {
    const {type, payload} = data
    if (type === 'weo_auth') {
      dispatch(signInWithWeo(payload))
    }
  })
  function * startWeoSignIn (token) {
    const {value} = yield actions.fetch(`${process.env.CLOUD_FUNCTIONS}/weoAuth`, {
      method: 'POST',
      body: JSON.stringify({
        token
      })
    })
    return value
  }
  auth().onAuthStateChanged((user) => {
    if (!user) {
      dispatch(actions.setUserId(null))
      return auth().signInAnonymously()
    }
    if (user && !user.isAnonymous) {
      return dispatch(maybeCreateNewUser(user))
    }
    return dispatch(actions.setUserId(user))
  })
  return (next) => (action) => {
    if (action.type === SIGN_IN_WITH_PROVIDER) {
      var provider = providers[action.payload]()
      auth().setPersistence(auth.Auth.Persistence.SESSION)
      auth().signInWithPopup(provider).then(function (result) {
        dispatch(setUrl('/'))
      }).catch(function (error) {
        if (error.code === 'auth/credential-already-in-use') {
          console.log(error)
          return auth.signInWithCredential(error.credential)
        }
      })
    }
    if (action.type === signInWithToken.type) {
        auth().signInWithCustomToken(action.payload)
        .then(() => dispatch(setUrl('/')))
        .catch(e => console.warn(e))
    }
    if (action.type === SIGN_OUT) {
      auth().signOut()
    }
    return next(action)
  }

  function * maybeCreateNewUser (user) {
    const maybeUser = yield checkUsers(user.uid)
    if (maybeUser.exists()) {
      yield actions.setUserId(user)
      return yield actions.setUsername(maybeUser.val().username)
    }
    const username = yield createUsername(user)
    try {
      yield firebaseSet(`/users/${user.uid}`, {
        username,
        displayName: user.displayName || user.providerData[0].displayName,
        photoURL: ''
      })
      yield actions.setUserId(user)
    } catch (e) {
      console.warn(e)
    }
  }

  function createName (user, ext) {
    const userData = user.providerData[0] ? user.providerData[0] : user
    if (userData.email) {
      return userData.email.split('@')[0].replace('.', '') + ext
    } else {
      return userData.displayName.replace(' ', '') + ext
    }
  }

  function * createUsername (user, ext = '', username = '') {
    username = username || createName(user, ext)
    const snap = yield firebaseOnce(`/usernames/${username}`)
    if (snap.exists()) {
      return yield createUsername(user, ext ? ++ext : 1)
    } else {
      yield firebaseSet(`/usernames/${username}`, user.uid)
      yield actions.setUsername(username)
      return username
    }
  }
}

function * checkUsers (uid) {
  const snap = yield firebaseOnce(`/users/${uid}`)
  return snap
}

export {
	signInWithProvider,
  setUserProfile,
  signInWithToken,
	signOut
}
