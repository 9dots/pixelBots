import IndeterminateProgress from '../components/IndeterminateProgress'
import {Block, Card, Flex, Menu, Icon, Grid, Text} from 'vdux-ui'
import CreatePlaylist from '../components/CreatePlaylist'
import createAction from '@f/create-action'
import PlaylistView from './PlaylistView'
import {MenuItem} from 'vdux-containers'
import Level from '../components/Level'
import deepEqual from '@f/deep-equal'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import mapValues from '@f/map-values'
import reduce from '@f/reduce'
import fire from 'vdux-fire'

const selectActivePlaylist = createAction('<PlaylistFeed/>: selectActivePlaylist')
const setModal = createAction('<PlaylistFeed/>: setModal')
const clearModal = createAction('<PlaylistFeed/>: clearModal')

const initialState = ({props, local}) => ({
	modal: false,
	active: props.playlists ? 0 : '',
	actions: {
		selectActivePlaylist: local((val) => selectActivePlaylist(val)),
		setModal: local(setModal),
		clearModal: local(clearModal)
	}
})

function * onUpdate (prev, {props, state}) {
	if (!deepEqual(prev.state, state) || !deepEqual(prev.props, props)) {
		if (!props.playlists) {
			return yield state.actions.selectActivePlaylist(' ')
		}
		if (Object.keys(props.playlists).length < prev.state.active) {
			return yield state.actions.selectActivePlaylist(0)
		}
	}
}

function render ({props, state, local}) {
	const {playlists = {}, mine, uid} = props

	const items = mapValues((val) => val, playlists)
	const {actions, active, modal} = state

	return (
		<Flex tall wide>
			<Menu column spacing='2px' mt='2px' tall overflowY='auto'>
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
					h='65px'
					column
					align='space-around'
					highlight={active === key}
					p='10px 20px'
					onClick={() => actions.selectActivePlaylist(key)}
					color='#333'>
	          <Text fs='m' fontWeight='300'>{item.name}</Text>
	          {uid !== item.creatorID && <Text fs='xs'>by {item.creatorUsername}</Text>}
				</MenuItem>), [], items)}
			</Menu>
			{(items && items[active] && items[active].ref) && <PlaylistView
				mine={mine}
				ref={items[active].key}
				uid={uid}
				activeKey={items[active].ref}/>}
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
	onUpdate,
	reducer,
	render
}
