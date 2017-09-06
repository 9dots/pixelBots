/**
 * Imports
 */

import {Modal, ModalHeader, ModalFooter, ModalBody} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'

/**
 * <Confirm Reset Modal/>
 */

export default component({
  render ({props, context}) {
    return (
    	<Modal onDismiss={context.closeModal}>
    		<ModalHeader pt='l' pb='s'>
    			Reset Challenge
    		</ModalHeader>
    		<ModalBody textAlign='center' py>
  				Are you sure you want to reset?  You will lose all of your progress.
    		</ModalBody>
    		<ModalFooter bgColor='primary' p='12px' color='white' fs='xs'>
    			<Button bgColor='#b9b9b9' fs='s' px='m' py='xs' onClick={context.closeModal} mr='s'>
    				Cancel
    			</Button>
    			<Button bgColor='red' fs='s' px='m' py='xs' onClick={[props.onSubmit, context.closeModal]}>
    				Reset
    			</Button>
    		</ModalFooter>
    	</Modal>
    )
  }
})
