/**
 * Imports
 */

import {Button, Modal, ModalHeader, ModalFooter, ModalBody} from 'vdux-containers'
import WinGraphic from 'components/WinGraphic'
import {component, element} from 'vdux'
import {Block, Text, Icon} from 'vdux-ui'

/**
 * <Modal Message/>
 */

export default component({
  render ({props, context, children}) {
    const {closeModal} = context
    const {
      header,
      headerColor = 'blue',
      noFooter,
      body,
      fullscreen,
      footer,
      type,
      dismiss = closeModal,
      onSubmit = () => {},
      ...restProps
    } = props

    const fullScreenProps = {
      w: '100%',
      h: '100%',
      m: '0',
      top: '0',
      pt: props.headerBg ? 0 : 40
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
          mb='s'
          fs='l'>
          {
            type === 'win' && <WinGraphic />
          }
          <Block>{header}</Block>
        </ModalHeader>
        <ModalBody flex bgColor={props.bgColor || 'white'} pb='l'>
          <Text fontWeight='300' fs='m' fontFamily='ornate' color='#333'>{body}</Text>
        </ModalBody>
        {!noFooter && (
          <ModalFooter bgColor='#666' p='12px'>
            {footer || <Button fs='s' px='l' py='s' bgColor={type === 'error' ? 'error' : 'blue'} onClick={[dismiss, closeModal]}>OK</Button>}
          </ModalFooter>
        )}
        {children}
        {
          fullscreen &&
            <Button absolute top right m='16' fs='xl' color='#999' hoverProps={{color: '#666'}} onClick={[dismiss, onSubmit]} icon='close'/>
        }
      </Modal>
    )
  }
})
