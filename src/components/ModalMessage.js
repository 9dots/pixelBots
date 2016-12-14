/** @jsx element */

import element from 'vdux/element'
import {Modal, ModalHeader, ModalFooter, ModalBody, Button} from 'vdux-containers'
import {Block, Text} from 'vdux-ui'
import {clearMessage} from '../actions'
import createAction from '@f/create-action'
import WinAnimals from './WinAnimals'

function render ({props, state}) {
  const {header, body, footer, type, animals=[], clickHandler = [], dismiss = clearMessage} = props

  return (
    <Modal overlayProps={{fixed: true, top: 0, left: 0}} onDismiss={dismiss} onKeyup={{esc: dismiss}}>
      <ModalHeader flex column align='center center' color={type === 'error' ? 'error' : 'blue'} p='l' fs='xl'>
        {
          type === 'win' && <WinAnimals animals={animals}/>
        }
        <Block>{header}</Block>
      </ModalHeader>
      <ModalBody>
        <Block mb='2em'>
          <Text fs='m' fontFamily='ornate' color='#333'>{body}</Text>
        </Block>
      </ModalBody>
      <ModalFooter>
        {footer ? footer : <Button fs='m' p='8px' bgColor={type === 'error' ? 'error' : 'green'} onClick={dismiss}>Okay</Button>}
      </ModalFooter>
    </Modal>
  )
}

export default {
  render
}
