import firebaseConfig from 'client/firebaseConfig'
import { setUrl } from 'redux-effects-location'
import createAction from '@f/create-action'
import { set as firebaseSet, once as firebaseOnce } from 'vdux-fire'
import firebase from 'firebase'

const signInWithToken = createAction('SIGN_IN_WITH_TOKEN')
const setUserProfile = createAction('SET_USER_PROFILE')

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

export default ({ actions, dispatch, getState }) => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
  const connectedRef = firebase.database().ref('.info/connected')
  connectedRef.on('value', function (snap) {
    const { connected } = getState() || {}
    try {
      if (connected && snap.val() === false) {
        dispatch(actions.setConnected(false))
      } else {
        dispatch(actions.setConnected(true))
      }
    } catch (e) {
      // waiting for middleware to be ready
    }
  })
  auth().setPersistence(auth.Auth.Persistence.SESSION)
  auth().onAuthStateChanged(user => {
    if (!user) {
      dispatch(actions.setUserId(null))
      return auth()
        .signInAnonymously()
        .catch(e => console.warn(e))
    }
    if (user && !user.isAnonymous) {
      return dispatch(maybeCreateNewUser(user))
    }
    return dispatch(actions.setUserId(user))
  })
  return next => action => {
    if (action.type === SIGN_IN_WITH_PROVIDER) {
      var provider = providers[action.payload]()
      auth()
        .signInWithPopup(provider)
        .then(function (result) {
          dispatch(setUrl('/'))
        })
        .catch(function (error) {
          if (error.code === 'auth/credential-already-in-use') {
            console.log(error)
            return auth.signInWithCredential(error.credential)
          }
        })
    }
    if (action.type === signInWithToken.type) {
      auth()
        .signInWithCustomToken(action.payload)
        .then(u => dispatch(setUrl('/', console.log(u))))
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
      return yield actions.setUsername(maybeUser.val())
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
  const snap = yield firebaseOnce(`/users/${uid}/username`)
  return snap
}

export { signInWithProvider, setUserProfile, signInWithToken, signOut }
