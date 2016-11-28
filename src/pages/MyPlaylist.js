import IndeterminateProgress from '../components/IndeterminateProgress'
import element from 'vdux/element'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'vdux-ui'
import {Input} from 'vdux-containers'
import fire, {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import {createCode} from '../utils'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'

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

function render ({props}) {
	const {playlist} = props

	if (playlist.loading) {
		return <IndeterminateProgress/>
	}

	const listProps = playlist.value

	const modal = <Modal dismissOnClick={false} dismissOnEsc={false} overlayProps={modalProps}>
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
		const saveIds = yield createSaveCodes(listProps.sequence.length)
		const savedListRef = yield refMethod({
			ref: `/savedList/`,
			updates: {method: 'push', value: {
				...listProps,
				studentName: textVal,
				assignmentRef: props.ref,
				saveIds,
				current: 0
			}}
		})
		const code = yield createCode()
		yield refMethod({
			ref: `/links/${code}`,
			updates: {
				method: 'set',
				value: {
					type: 'list',
					payload: savedListRef.key
				}
			}
		})
		yield setUrl(`/${code}`)
	}
}

function * createSaveCodes (num) {
	const saveCodes = []
	for (var i = 0; i < num; i++) {
		const saveRef = yield refMethod({
			ref: '/saved/',
			updates: {
				method: 'push',
				value: ''
			}
		})
		saveCodes.push(saveRef.key)
	}
	return saveCodes
}


export default fire ((props) => ({
	playlist: `/playlists/${props.ref}`
}))({
	render
})