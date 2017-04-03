/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {Block, Input} from 'vdux-containers'
import {component, element, decodeValue} from 'vdux'
import Button from 'components/Button'
import validator from 'schema/link'
import Form from 'vdux-form'

/**
 * <Code Link/>
 */

export default component({
	initialState: {
		textVal: ''
	},

  render ({props, state, actions, context}) {
  	const {textVal} = state
  	const footer = (
			<Block>
				<Button bgColor='secondary' onClick={context.closeModal()}>Cancel</Button>
				<Button ml='m' form='code-link-form' bgColor='blue' type='submit'>Go</Button>
			</Block>
		)
		const body = (
			<Block>
				<Form id='code-link-form' validate={validator} onSubmit={actions.handleSubmit()}>
					<Input
						autofocus
			      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
			      id='url-input'
			      name='link'
			      fs='18px'
			      onKeyUp={decodeValue(actions.setText)}
			      value={textVal}/>
	      </Form>
	    </Block>
		)

		return (
			<ModalMessage
				header='Code Link'
				body={body}
				footer={footer}/>
		)
  },

  controller: {
  	* handleSubmit ({context, state}) {
  		const {textVal} = state
  		yield context.setUrl(`/${textVal.toUpperCase()}`)
  		yield context.closeModal()
  	}
  },

  reducer: {
  	setText: (state, textVal) => ({textVal})
  }
})
