import element from 'vdux/element'
import firebase from 'firebase'
import config from '../firebaseConfig'
import {Modal, ModalBody} from 'vdux-ui'

// Copy this from the Firebase Console.

var authUi

function onCreate ({props}) {
  authUi = new firebaseui.auth.AuthUI(firebase.auth());
  const {onSignIn} = props
  const uiConfig = {
    'callbacks': {
      'signInSuccess': function(user) {
        if (onSignIn) {
          onSignIn(user)
        }
        return false
      }
    },
    'signInOptions': [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
  }
  setTimeout(() => authUi.start('#firebaseui-auth', uiConfig))
}

function onRemove () {
  console.log('remove')
  authUi.reset()
}

function render ({props}) {
  const {handleDismiss} = props
  return (
    <Modal onDismiss={handleDismiss()} overlayProps={{top: '0'}}>
      <ModalBody bgColor='#e5e5e5'>
        <div id="firebaseui-auth"/>
      </ModalBody>
    </Modal>
  )
}

export default {
  onCreate,
  onRemove,
  render
}