import element from 'vdux/element'
import {Block, Icon, Flex, Modal, ModalBody, Text} from 'vdux-ui'
import {Dropdown, MenuItem} from 'vdux-containers'
import {refMethod} from 'vdux-fire'
import createAction from '@f/create-action'

const setModal = createAction('SET_MODAL')

const initialState = () => ({
	modal: ''
})

function render ({props, local, state}) {
	const {num, clearSelected, playlists=[]} = props
	const {modal} = state
	return (
		<Flex p='20px' color='white' wide h='60px' bgColor='red'>
			<Block flex align='start center'>
				<Icon cursor='pointer' mr='20px' name='close' onClick={clearSelected}/>
				<Text fontWeight='800'>{num} selected</Text>
			</Block>
			<Block>
				<Dropdown zIndex='999' btn={<Icon cursor='pointer' onClick={addToPlaylist} name='add'/>}>
					<Block py='10px' w='150px'>
						<MenuItem fontWeight='300' wide onClick={local(createNewPlaylist)}>New Playlist</MenuItem>
						{playlists.map((playlist) => <MenuItem wide>{playlist.name}</MenuItem>)}
					</Block>
				</Dropdown>
			</Block>
			{modal}
		</Flex>
	)
}

function * createNewPlaylist () {
	yield setModal(<Modal><ModalBody>This is a Modal</ModalBody></Modal>)
}

function reducer (state, action) {
	switch (action.type) {
		case setModal.type:
			return {
				...state,
				modal: action.payload
			}
	}
	return state
}

function * addToPlaylist () {

}

export default {
	initialState,
	reducer,
	render
}