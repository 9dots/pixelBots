/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block} from 'vdux-ui'

/**
 * <Confirm Delete/>
 */

export default component({
  render ({props}) {
	  const {action, dismiss, header, message} = props
	  const footer = <Block>
	    <Button bgColor='secondary' onClick={dismiss}>Cancel</Button>
	    <Button ml='1em' bgColor='red' onClick={[dismiss, action]}>Accept</Button>
	  </Block>

	  return (
	    <ModalMessage
	      header={header}
	      body={`Are you sure you want to ${message}`}
	      dismiss={dismiss}
	      footer={footer} />
	  )
  }
})
