/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Input, Block} from 'vdux-ui'
import { Button } from 'vdux-containers'
import {component, element, decodeValue} from 'vdux'

/**
 * <Function Modal/>
 */

export default component({
	initialState ({props}) {
		return {textValue: props.value}
	},
  render ({props, context, state, actions}) {
  	const { onSubmit, value } = props
  	const { closeModal } = context
  	const { textValue = '' } = state
  	const maxlength = 15

    return (
    	<Modal onDismiss={closeModal}>
    		<ModalHeader>
    			Name Your Function
    		</ModalHeader>
    		<ModalBody w={420} mx='auto'>
    			<Input
    				autofocus
						autocomplete='off'
			      inputProps={{p: '12px', textAlign: 'center'}}
			      fs='18px'
			      mb
			      wide
			      fontFamily='monospace'
			      maxlength={maxlength}
			      value={textValue}
			      onKeyUp={decodeValue(actions.setTextValue)} />
			      <Block textAlign='right' fs='xs' mb='l'>
			      	{`${textValue.length} / ${maxlength}`}
			      </Block>
    		</ModalBody>
    		<ModalFooter bgColor='#666' p='12px'>
          <Button fs='s' px='l' py='s' bgColor='blue' onClick={[closeModal, onSubmit(textValue)]}>
          	OK
          </Button>
          </ModalFooter>
    	</Modal>
    )
  },
  reducer: {
  	setTextValue: (state, textValue) => ({textValue})
  }
})
