/**
 * Imports
 */

import {Button} from 'vdux-containers'
import {component, element} from 'vdux'
import {
  Block,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'vdux-ui'

/**
 * <Auth/>
 */

export default component({
  render ({props, context}) {
    const {handleDismiss} = props
    const {signIn, closeModal} = context
    return (
      <Modal w='280px' onDismiss={closeModal()} overlayProps={{top: '0'}}>
        <ModalHeader bgColor='#e5e5e5' pt='1em' pb='0' fs='m' color='#333' fontWeight='800'>Sign In</ModalHeader>
        <ModalBody p='20px' bgColor='#e5e5e5'>
          <Flex column>
            <Flex column>
              <Button textAlign='right' bgColor='#DD4B39' onClick={[signIn('google'), closeModal()]} mb='10px' px='15px' fs='s'>
                <Image absolute left='10px' h='24px' w='24px' src='/authImages/google.png'/>
                <Block relative left='10px'><Text>Sign in with Google</Text></Block>
              </Button>
              <Button textAlign='right' bgColor='#4267B2' onClick={[signIn('facebook'), closeModal()]} mb='10px' px='15px' fs='s'>
                <Image absolute left='10px' h='24px' w='24px' src='/authImages/facebook.png'/>
                <Block relative left='19px'><Text>Sign in with Facebook</Text></Block>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </Modal>
    )
  }
})
