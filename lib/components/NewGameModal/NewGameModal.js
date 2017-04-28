/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block} from 'vdux-ui'

/**
 * <NewGameModal/>
 */

export default component({
  render ({props, context}) {
  	const {load, createNew, dismiss} = props
  	const footer = (
  		<Block>
  			<Button onClick={[load, context.closeModal]}>Load Finished</Button>
  			<Button bgColor='blue' ml='1em' onClick={[createNew, context.closeModal]}>Create New</Button>
  		</Block>
  	)

    return (
    	<ModalMessage
    		header='Create New Game?'
        dismiss={dismiss}
    		body='Would you like to make a new game or view your previous code?'
    		footer={footer}
    	/>
    )
  }
})
