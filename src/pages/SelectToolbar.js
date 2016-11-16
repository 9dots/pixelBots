import element from 'vdux/element'
import {Block, Icon, Flex, Modal, ModalBody, ModalHeader, ModalFooter, Text} from 'vdux-ui'
import {Dropdown, Input, MenuItem} from 'vdux-containers'
import Button from '../components/Button'
import {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import reduce from '@f/reduce'
import createAction from '@f/create-action'

const setModal = createAction('SELECT TOOLBAR: SET_MODAL')
const clearModal = createAction('SELECT TOOLBAR: CLEAR_MODAL')
const setText = createAction('SELECT TOOLBAR: SET_TEXT')

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
	playlistName: ''
})

function render ({props, local, state}) {
	const {num, uid, selected, clearSelected, playlists=[]} = props
	const {modal, playlistName} = state

	console.log(modal, playlistName)

	return (
		<Flex p='20px' color='white' wide h='60px' bgColor='red'>
			<Block flex align='start center'>
				<Icon cursor='pointer' mr='20px' name='close' onClick={clearSelected}/>
				<Text fontWeight='800'>{num} selected</Text>
			</Block>
			<Block>
				<Dropdown zIndex='999' btn={<Icon cursor='pointer' name='add'/>}>
					<Block py='10px' w='150px'>
						<MenuItem fontWeight='300' wide onClick={local(setModal)}>New Playlist</MenuItem>
						{reduce((cur, playlist) => cur.concat(<MenuItem wide>{playlist.name}</MenuItem>), [], playlists)}
					</Block>
				</Dropdown>
			</Block>
			{modal && <Modal color='#333' onDismiss={local(clearModal)} overlayProps={modalProps}>
				<ModalHeader py='1em'>Create a Playlist</ModalHeader>
				<ModalBody>
					<Input h='42px'
            name='levelSize'
            inputProps={inputProps}
            onKeyUp={local((e) => setText(e.target.value))}/>
				</ModalBody>
				<ModalFooter>
					<Button onClick={local(clearModal)} bgColor='secondary'>Cancel</Button>
					<Button onClick={[createPlaylist, local(clearModal)]} ml='1em' bgColor='primary'>Save</Button>
				</ModalFooter>
			</Modal>}
		</Flex>
	)

	function * createPlaylist () {
		const code = yield createCode('/playlists/')
		yield refMethod({
			ref: `/playlists/${code}`,
			updates: {
				method: 'set',
				value: {
					creatorID: uid,
					name: playlistName
				}
			}
		})
		yield addToPlaylist(code)
		yield clearSelected()
	}

	function * addToPlaylist (code) {
		yield refMethod ({
			ref: `/playlists/${code}`,
			updates: {
				method: 'transaction',
				value: (val) => {
					if (!val) {
						return 0
					} else {
						return {
							...val,
							sequence: selected
						}
					}
				}
			}
		})
	}
}

function reducer (state, action) {
	switch (action.type) {
		case setModal.type:
			return {
				...state,
				modal: true
			}
		case clearModal.type:
			return {
				...state,
				modal: ''
			}
		case setText.type:
			return {
				...state,
				playlistName: action.payload
			}
	}
	return state
}

export default {
	initialState,
	reducer,
	render
}