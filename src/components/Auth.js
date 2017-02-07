import element from 'vdux/element'
import {Block, Flex, Modal, ModalBody, ModalHeader, Text} from 'vdux-ui'
import {signInWithProvider} from '../middleware/auth'
import Button from './Button'

function render ({props}) {
  const {handleDismiss} = props
  return (
    <Modal w='280px' onDismiss={handleDismiss} overlayProps={{top: '0'}}>
      <ModalHeader bgColor='#e5e5e5' pt='1em' pb='0' fs='m' color='#333' fontWeight='800'>Sign In</ModalHeader>
      <ModalBody p='20px' bgColor='#e5e5e5'>
        <Flex column>
          <Flex column>
            <Button textAlign='right' bgColor='#DD4B39' onClick={() => handleSignIn('google')}  mb='10px' px='15px'  fs='s'>
              <img style={{position: 'absolute', left:'10px', height:'24px', width:'24px'}} src='/authImages/google.png'/>
              <Block relative left='10px'><Text>Sign in with Google</Text></Block>
            </Button>
            <Button textAlign='right' bgColor='#4267B2' onClick={() => handleSignIn('facebook')}  mb='10px' px='15px'  fs='s'>
              <img style={{position: 'absolute', left: '8px', height: '24px', width: '24px'}} src='/authImages/facebook.png'/>
              <Block relative left='19px'><Text>Sign in with Facebook</Text></Block>
            </Button>
          </Flex>
        </Flex>
      </ModalBody>
    </Modal>
  )

  function * handleSignIn (provider) {
    yield handleDismiss()
    yield signInWithProvider(provider)
  }
}

export default {
  render
}
