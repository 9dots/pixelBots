/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Input, Block} from 'vdux-ui'
import {component, element, decodeValue} from 'vdux'
import { Button } from 'vdux-containers'
import validator from 'schema/userFn'
import Form from 'vdux-form'

/**
 * <Function Modal/>
 */

export default component({
	initialState ({props}) {
		return {textValue: props.block.payload}
	},
  render ({props, context, state, actions}) {
  	const { onSubmit, block, fn = function () {} } = props
  	const { closeModal } = context
  	const { textValue = '' } = state
  	const maxlength = 15

    return (
    	<Form id='user-fn-form'  validate={validator} onSubmit={actions.submit}>
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
				      id='user-fn'
				      name='userFn'
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
	          <Button fs='s' px='l' py='s' bgColor='blue' type='submit'>
	          	OK
	          </Button>
	          </ModalFooter>
	    	</Modal>
    	</Form>
    )
  },
  reducer: {
  	setTextValue: (state, textValue) => ({textValue})
  },
  controller: {
  	* submit ({props, state, context}) {
  		const {block, onSubmit, fn} = props

  		if(fn) yield fn(block)
  		yield context.closeModal
  		yield onSubmit(block, state.textValue)
  	}
  }
})
