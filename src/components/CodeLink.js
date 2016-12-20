import ModalMessage from './ModalMessage'
import {Block, Input} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import element from 'vdux/element'
import Button from './Button'
import sleep from '@f/sleep'
import Form from 'vdux-form'
import createAction from '@f/create-action'
import {clearMessage, refresh} from '../actions'
import validator from '../schema/link'
import handleActions from '@f/handle-actions'

const setText = createAction('<CodeLink/>: SET_TEXT')

const initialState = ({local}) => ({
	textVal: '',
	actions: {
		setText: local((val) => setText(val))
	}
})

const footer = (
	<Block>
		<Button bgColor='secondary' onClick={clearMessage}>Cancel</Button>
		<Button ml='m' form='code-link-form' bgColor='blue' type='submit'>Go</Button>
	</Block>
)

function render ({props, state}) {
	const {textVal, actions} = state
	const body = (
		<Block>
			<Form id='code-link-form' validate={validator} onSubmit={handleSubmit}>
				<Input
					autofocus
		      inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
		      id='url-input'
		      name='link'
		      fs='18px'
		      onKeyUp={(e) => actions.setText(e.target.value)}
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

	function * handleSubmit () {
		yield refresh()
		yield setUrl(`/${textVal}`)
		yield clearMessage()
	}
}

const reducer = handleActions({
	[setText]: (state, payload) => ({...state, textVal: payload})
})

export default {
	initialState,
	reducer,
	render
}