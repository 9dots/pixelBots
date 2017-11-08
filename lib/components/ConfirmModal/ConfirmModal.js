/**
 * Imports
 */

import { Modal, ModalHeader, ModalFooter, ModalBody } from 'vdux-ui'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'

/**
 * <Confirm Modal/>
 */

export default component({
  render ({ props, context }) {
    const {
      title = 'Confirm',
      body = 'Are you sure you want to do this?',
      onSubmit = () => {},
      confirmText = 'Confirm',
      cancelText = 'Cancel'
    } = props

    return (
      <Modal onDismiss={context.closeModal}>
        <ModalHeader pt='l' pb='s'>
          {title}
        </ModalHeader>
        <ModalBody textAlign='center' py>
          {body}
        </ModalBody>
        <ModalFooter bgColor='primary' p='12px' color='white' fs='xs'>
          <Button
            bgColor='#b9b9b9'
            fs='s'
            px='m'
            py='xs'
            onClick={context.closeModal}
            mr='s'>
            {cancelText}
          </Button>
          <Button
            bgColor='red'
            fs='s'
            px='m'
            py='xs'
            onClick={[onSubmit, context.closeModal]}>
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
})
