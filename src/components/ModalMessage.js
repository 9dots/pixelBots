/** @jsx element */

import element from 'vdux/element'
import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'
import {clearMessage} from '../actions'

function render ({props}) {
  const {header, body, clickHandler = []} = props
  const onClick = [clearMessage, ...clickHandler]

  return (
    <Modal overlayProps={{fixed: true, top: 0, left: 0}} onDismiss={onClick} onKeyup={{esc: onClick}}>
      <ModalHeader p='l' fs='xl'>{header}</ModalHeader>
      <ModalBody>
        <Block>
          <Text fs='m' fontFamily='ornate'>{body}</Text>
        </Block>
      </ModalBody>
      <ModalFooter>
        <Button fs='m' p='8px' onClick={onClick}>Okay</Button>
      </ModalFooter>
    </Modal>
  )
}

export default {
  render
}
