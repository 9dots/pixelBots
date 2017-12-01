/**
 * Imports
 */

import { Modal } from 'vdux-ui'
import { component, element } from 'vdux'
import AnimationView from 'pages/AnimationView'

/**
 * <PreviewModal/>
 */

export default component({
  render ({ props, state, actions, context }) {
    const { closeModal } = context

    return (
      <Modal my='l' h='90vh' w='90vw' onDismiss={closeModal()} display='flex'>
        <AnimationView isModal closeModal={closeModal} {...props} />
      </Modal>
    )
  }
})
