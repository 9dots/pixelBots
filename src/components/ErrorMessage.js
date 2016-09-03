/** @jsx element */

import element from 'vdux/element'
import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'
import {clearError} from '../actions'

function render ({props}) {
  const {message, lineNumber} = props

  return (
    <Modal onDismiss={clearError} onKeyup={{esc: clearError}}>
      <ModalHeader p='l' fs='xl'>{message}</ModalHeader>
      <ModalBody>
        <Block>
          <Text fs='m' fontFamily='ornate'>Check the code at line number {lineNumber}.</Text>
        </Block>
      </ModalBody>
      <ModalFooter>
        <Button fs='m' p='8px' onClick={clearError}>Okay</Button>
      </ModalFooter>
    </Modal>
  )
}

export default {
  render
}
