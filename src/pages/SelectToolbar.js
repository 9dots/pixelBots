import {Block, Icon, Flex, Modal, ModalBody, ModalHeader, ModalFooter, Text} from 'vdux-ui'
import CreatePlaylist from '../components/CreatePlaylist'
import {Dropdown, Input, MenuItem} from 'vdux-containers'
import createAction from '@f/create-action'
import Button from '../components/Button'
import {setToast} from '../actions'
import {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import element from 'vdux/element'
import Window from 'vdux/window'
import reduce from '@f/reduce'
import {union} from 'lodash'
import sleep from '@f/sleep'

const setModal = createAction('<SelectToolbar/>: SET_MODAL')
const clearModal = createAction('<SelectToolbar/>: CLEAR_MODAL')
const setFixed = createAction('<SelectToolbar/>: SET_FIXED')
const setRelative = createAction('<SelectToolbar/>: SET_RELATIVE')

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

const initialState = ({local}) => ({
	modal: '',
	playlistName: '',
	position: getInitialPosition(document.getElementsByClassName('action-bar-holder')[0]),
	actions: {
		setFixed: local(setFixed),
		setRelative: local(setRelative)
	}
})

function getInitialPosition (target) {
	if (target.scrollTop > 100) {
		return 'fixed'
	} else {
		return 'relative'
	}
}

function render ({props, local, state}) {
	const {num, uid, selected, clearSelected, playlists=[]} = props
	const {modal, actions, playlistName, position} = state
	return (
		<Window onScroll={maybeFixed}>
			<Block>
				<Flex
					position={position}
					px='20px'
					top='0'
					color='white'
					zIndex='999'
					left={position === 'fixed' ? '90px' : '0'}
					w={position === 'fixed' ? 'calc(100% - 90px)' : '100%'}
					h='42px'
					bgColor='red'
					align='start center'>
					<Block flex align='start center'>
						<Icon cursor='pointer' mr='20px' name='close' onClick={clearSelected}/>
						<Text fontWeight='800'>{num} selected</Text>
					</Block>
					<Block align='center center'>
						<Dropdown zIndex='999' btn={<Icon mt='4px' cursor='pointer' name='add'/>}>
							<Block maxHeight='300px' py='10px' w='150px' overflowY='auto'>
								<MenuItem fontWeight='300' wide onClick={local(setModal)}>New Playlist</MenuItem>
								{reduce((cur, playlist, key) => cur.concat(<MenuItem fontWeight='600' onClick={() => addToPlaylist(playlist.ref, playlist.name)} wide>{playlist.name}</MenuItem>), [], playlists)}
							</Block>
						</Dropdown>
					</Block>
					{modal && <CreatePlaylist
						uid={uid}
						selected={selected}
						handleDismiss={local(clearModal)}
						onAddToPlaylist={clearSelected}/>
					}
				</Flex>
				{position === 'fixed' && <Block wide h='42px'/>}
			</Block>
		</Window>
	)

	function * maybeFixed (e) {
		if (e.target.scrollTop > 100) {
			yield actions.setFixed()
		} else {
			yield actions.setRelative()
		}
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
		yield clearSelected()
		yield sleep(3000)
		yield setToast('')
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
		case setFixed.type:
			return {
				...state,
				position: 'fixed'
			}
		case setRelative.type:
			return {
				...state,
				position: 'relative'
			}
	}
	return state
}

export default {
	initialState,
	reducer,
	render
}