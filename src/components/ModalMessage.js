/** @jsx element */

import element from 'vdux/element'
import {Modal, ModalHeader, ModalFooter, ModalBody} from 'vdux-containers'
import Button from './Button'
import {Block, Text} from 'vdux-ui'
import {clearMessage} from '../actions'
import WinAnimals from './WinAnimals'

function render ({props, state, children}) {
  const {
    header,
    headerColor = 'blue',
    noFooter,
    body,
    bodyProps,
    fullscreen,
    footer,
    type,
    animals = [],
    dismiss = clearMessage,
    onSubmit = () => {},
    ...restProps
  } = props

  const fullScreenProps = {
    w: '100%',
    h: '100%',
    m: '0',
    top: '0',
    pt: props.headerBg ? '0' : '70px'
  }

  const headerBg = props.headerBg || 'transparent'

  const displayProps = fullscreen
    ? {...fullScreenProps, ...restProps}
    : restProps

  return (
    <Modal
      overlayProps={{fixed: true, top: 0, left: 0}}
      onDismiss={dismiss}
      onKeyup={{esc: dismiss}}
      {...displayProps}>
      <ModalHeader
        background={headerBg}
        column
        align='center center'
        color={type === 'error' ? 'error' : headerColor}
        p='l'
        fs='xl'>
        {
          type === 'win' && <WinAnimals animals={animals} />
        }
        <Block>{header}</Block>
      </ModalHeader>
      <ModalBody {...bodyProps} flex bgColor={props.bgColor || 'white'}>
        <Text fontWeight='300' fs='m' fontFamily='ornate' color='#333'>{body}</Text>
      </ModalBody>
      {!noFooter && (
        <ModalFooter>
          {footer || <Button fs='m' p='8px' bgColor={type === 'error' ? 'error' : 'blue'} onClick={dismiss}>Okay</Button>}
        </ModalFooter>
      )}
      {children}
      {fullscreen && <Block absolute top='1em' right='1em'>
        <Button ml='1em' bgColor={props.headerBg || 'blue'} onClick={[(e) => e.stopPropagation(), dismiss, onSubmit]}>X</Button>
      </Block>}
    </Modal>
  )
}

export default {
  render
}
