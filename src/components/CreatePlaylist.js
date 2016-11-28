import {Block, Icon, Flex, Modal, ModalBody, ModalHeader, ModalFooter, Text} from 'vdux-ui'
import {Dropdown, Input, MenuItem} from 'vdux-containers'
import createAction from '@f/create-action'
import validator from '../schema/playlist'
import Button from '../components/Button'
import {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import {setToast} from '../actions'
import element from 'vdux/element'
import reduce from '@f/reduce'
import {union} from 'lodash'
import sleep from '@f/sleep'
import Form from 'vdux-form'

const setText = createAction('SELECT TOOLBAR: SET_TEXT')
const setDescription = createAction('<CreatePlaylist/>: SET_DESCRIPTION')

const inputProps = {
  h: '42px',
  textIndent: '8px',
  borderRadius: '2px',
  border: '2px solid #ccc'
}

const modalProps = {
	position: 'fixed',
	left: '0',
	top: '0'
}

const initialState = () => ({
	modal: '',
	playlistName: '',
	playlistDescription: ''
})

function render ({props, local, state}) {
	const {uid, username, selected = [], handleDismiss = () => {}, onAddToPlaylist = () => {}} = props
	const {modal, playlistName, playlistDescription} = state
	return (
			<Modal color='#333' onDismiss={handleDismiss} overlayProps={modalProps}>
				<Form id='create-playlist' onSubmit={createPlaylist} validate={validator.playlist}>
					<ModalHeader py='1em'>Create a Playlist</ModalHeader>
					<ModalBody>
						<Input h='42px'
	            name='playlistTitle'
	            placeholder='Title'
	            name='name'
	            required
	            inputProps={inputProps}
	            onKeyUp={local((e) => setText(e.target.value))}/>
	          <Input h='42px'
	            name='playlistDescription'
	            placeholder='Description'
	            name='description'
	            required
	            inputProps={inputProps}
	            onKeyUp={local((e) => setDescription(e.target.value))}/>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleDismiss} bgColor='secondary'>Cancel</Button>
						<Button form='create-playlist' type='submit' ml='1em' bgColor='primary'>Save</Button>
					</ModalFooter>
				</Form>
			</Modal>
	)

	function * createPlaylist () {
		const playlistRef = yield refMethod({
			ref: `/playlists/`,
			updates: {
				method: 'push',
				value: {
					creatorID: uid,
					name: playlistName,
					description: playlistDescription
				}
			}
		})
		if (selected.length > 0) {
			yield addToPlaylist(playlistRef.key, playlistName)
		}
		yield handleDismiss()
		yield refMethod({
			ref: `/users/${uid}/playlists`,
			updates: {
				method: 'push',
				value: playlistRef.key
			}
		})
	}

	function * addToPlaylist (code, name) {
		yield refMethod ({
			ref: `/playlists/${code}`,
			updates: {
				method: 'transaction',
				value: (val) => {
					if (!val) {
						return 0
					} else {
						const sequence = val.sequence ? union(val.sequence, selected) : selected
						return {
							...val,
							sequence
						}
					}
				}
			}
		})
		yield setToast(`${selected.length} added to ${name}`)
		yield onAddToPlaylist()
		yield sleep(3000)
		yield setToast('')
	}
}

function reducer (state, action) {
	switch (action.type) {
		case setText.type:
			return {
				...state,
				playlistName: action.payload
			}
		case setDescription.type:
			return {
				...state,
				playlistDescription: action.payload
			}
	}
	return state
}

function getProps (props, {username}) {
	return {
		...props,
		username
	}
}

export default {
	getProps,
	initialState,
	reducer,
	render
}