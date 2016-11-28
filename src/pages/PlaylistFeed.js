import IndeterminateProgress from '../components/IndeterminateProgress'
import {Block, Card, Flex, Menu, Icon, Grid, Text} from 'vdux-ui'
import CreatePlaylist from '../components/CreatePlaylist'
import createAction from '@f/create-action'
import PlaylistView from './PlaylistView'
import {MenuItem} from 'vdux-containers'
import Level from '../components/Level'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'

const selectActivePlaylist = createAction('<PlaylistFeed/>: selectActivePlaylist')
const setModal = createAction('<PlaylistFeed/>: setModal')
const clearModal = createAction('<PlaylistFeed/>: clearModal')

const initialState = ({props, local}) => ({
	active: Object.keys(props.items)[0],
	actions: {
		selectActivePlaylist: local((val) => selectActivePlaylist(val)),
		setModal: local(setModal),
		clearModal: local(clearModal)
	}
})

function render ({props, state, local}) {
	const {items, mine, uid} = props
	const {actions, active, modal} = state

	return (
		<Flex wide>
			<Menu column spacing='2px' mt='2px' maxHeight='calc(100vh - 142px)' overflowY='auto'>
			{mine && <MenuItem
							bgColor='#d5d5d5'
							align='start center'
							relative
							w='300px'
							onClick={actions.setModal}
							p='20px'
							color='#333'>
							<Icon name='add' mr='1em'/>
			        <Text fs='m' fontWeight='300'>New Playlist</Text>
			</MenuItem>}
			{reduce((cur, item, key) => cur.concat(
				<MenuItem
					bgColor='#d5d5d5'
					relative
					w='300px'
					highlight={active === key}
					p='20px'
					onClick={() => actions.selectActivePlaylist(key)}
					color='#333'>
	          <Text fs='m' fontWeight='300'>{item.name}</Text>
				</MenuItem>), [], items)}
			</Menu>
			<PlaylistView mine={mine} activeKey={active} playlist={items[active]}/>
			{modal && <CreatePlaylist
				uid={uid}
				handleDismiss={actions.clearModal}/>
			}
		</Flex>
	)
}

function reducer (state, action) {
	switch (action.type) {
		case selectActivePlaylist.type:
			return {
				...state,
				active: action.payload
			}
		case setModal.type:
			return {
				...state,
				modal: true
			}
		case clearModal.type:
			return {
				...state,
				modal: false
			}
	}
	return state
}


export default {
	initialState,
	reducer,
	render
}
