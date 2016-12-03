/** @jsx element */

import element from 'vdux/element'
import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'
import {clearMessage} from '../actions'
import createAction from '@f/create-action'

function render ({props, state}) {
  const {header, body, footer, clickHandler = [], dismiss = clearMessage} = props
  console.log(body)

  return (
    <Modal overlayProps={{fixed: true, top: 0, left: 0}} onDismiss={dismiss} onKeyup={{esc: dismiss}}>
      <ModalHeader p='l' fs='xl'>{header}</ModalHeader>
      <ModalBody>
        <Block>
          <Text fs='m' fontFamily='ornate' color='#333'>{body}</Text>
        </Block>
      </ModalBody>
      <ModalFooter>
        {footer ? footer : <Button fs='m' p='8px' onClick={dismiss}>Okay</Button>}
      </ModalFooter>
    </Modal>
  )
}

export default {
  render
}
