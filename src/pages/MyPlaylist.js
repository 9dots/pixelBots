import element from 'vdux/element'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'vdux-ui'
import {Input} from 'vdux-containers'
import {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import {createCode} from '../utils'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'

const setListProps = createAction('PLAYLIST LOADER: SET LIST PROPS')

const initialState = ({local}) => ({
	listProps: {},
	actions: {
		setListProps: local((list) => setListProps(list))
	}
})

const modalProps = {
	position: 'fixed',
	left: '0',
	top: '0'
}

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

function * onCreate ({props, state}) {
	const {actions} = state
	const plist = yield refMethod({
		ref: `/playlists/${props.ref}`,
		updates: {method: 'once', value: 'value'}
	})
	const code = yield createCode('/savedList/')
	yield actions.setListProps({val: plist.val(), code})
}

function render ({props, state, local}) {
	const {listProps} = state
	const modal = <Modal dismissOnClick={false} dismissOnEsc={false} overlayProps={{modalProps}}>
		<ModalHeader py='1em'>Enter Name</ModalHeader>
		<ModalBody>
			<Input inputProps={inputProps}/>
		</ModalBody>
		<ModalFooter>
			<Button bgColor='primary' onClick={() => submit('Daniel')}>Save</Button>
		</ModalFooter>
	</Modal>
	return (
		<div>{modal}</div>
	)

	function * submit (textVal) {
		yield refMethod({
			ref: `/savedList/${listProps.code}`,
			updates: {method: 'set', value: {
				...listProps.val,
				studentName: textVal,
				assignmentRef: props.ref
			}}
		})
		yield refMethod({
			ref: `/savedList/${listProps.code}/sequence`,
			updates: {
				method: 'transaction',
				value: (val) => {
					if (val === null) return 0
					return val.map((ref) => ({ref, saveID: '', completed: false}))
				}
			}
		})
		yield setUrl(`/list/${listProps.code}`)
	}
}


function reducer (state, action) {
	switch (action.type) {
		case setListProps.type:
			return {
				...state,
				listProps: action.payload
			}
	}
	return state
}

export default {
	initialState,
	reducer,
	onCreate,
	render
}