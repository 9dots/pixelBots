/**
 * Imports
 */

import {Button} from 'vdux-containers'
import {component, element} from 'vdux'
import {
  Block,
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
    const {signIn, closeModal} = context
    const btnProps = {wide: true, p: true, fs: 's'}

    return (
      <Modal w={460} onDismiss={closeModal()}>
        <ModalHeader fs='l' py='l'>Log In</ModalHeader>
        <ModalBody>
          <Button bgColor='#DD4B39' onClick={[signIn('google'), closeModal()]} {...btnProps} mb='m'>
            <Image absolute left='10px' h='24px' w='24px' src='/authImages/google.png' />
            <Block relative left='10px'>Sign in with Google</Block>
          </Button>
          <Button bgColor='#4267B2' onClick={[signIn('facebook'), closeModal()]} {...btnProps} mb='l'>
            <Image absolute left='10px' h='24px' w='24px' src='/authImages/facebook.png' />
            <Block relative left='19px'>Sign in with Facebook</Block>
          </Button>
          <Block m='auto' w='30%' align='space-around' pb='l' fs='xxs'>
            <a href='/terms'>Terms</a>
            <a href='/privacy'>Privacy</a>
          </Block>
        </ModalBody>
      </Modal>
    )
  }
})
