import IndeterminateProgress from '../components/IndeterminateProgress'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import ChallengeFeed from './ChallengeFeed'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import PlaylistFeed from './PlaylistFeed'
import ProfileTabs from './ProfileTabs'
import Tab from '../components/Tab'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'

const changeTab = createAction('PROFILE: CHANGE_TAB')
const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')
const toggleSelectMode = createAction('PROFLIE: TOGGLE_SELECT_MODE')
const setPlaylists = createAction('PROFILE: SET_PLAYLISTS')

const initialState = ({local}) => ({
	tab: 'games',
	selected: [],
	actions: {
		toggleSelected: local((key) => toggleSelected(key)),
		clearSelected: local(() => clearSelected()),
		toggleSelectMode: local(() => toggleSelectMode()),
		setPlaylists: local((items) => setPlaylists(items))
	}
})

function * onUpdate (prev, {props, state}) {
	if (prev.props.user.uid !== props.user.uid) {
		const items = yield refMethod({
	    ref: `/playlists/`,
	    updates: [
	      {method: 'orderByChild', value: 'creatorID'},
	      {method: 'equalTo', value: props.user.uid},
	      {method: 'limitToFirst', value: 50},
	      {method: 'once', value: 'value'}
	    ]
	  })
	  console.log(items)
		yield state.actions.setPlaylists(items.val())
  }
}

function render ({props, state, local}) {
	const {user} = props
	const {tab, actions, selected, playlists} = state
	const selectMode = selected.length > 0
	if (!user.uid) return <IndeterminateProgress/>

	return (
    <Flex py='20px' relative m='0 auto' column align='start center' minHeight='100%' w='96%'>
			<Card relative w='80%' bgColor='white' color='#333' fontWeight='800'>
				<Block align='start center' p='20px'>
					<Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='70px' w='70px' src={user.photoURL || user.providerData[0].photoURL}/>
					<Block ml='1em'>
						<Text fontWeight='800' fs='l'>{user.displayName || user.providerData[0].displayName}</Text>
					</Block>
				</Block>
				{!selectMode
					? <ProfileTabs tab={tab} changeTab={local((val) => changeTab(val))} />
					: <SelectToolbar
							selected={selected}
							playlists={playlists}
							uid={user.uid}
							clearSelected={actions.clearSelected}
							num={selected.length}/>}
			</Card>
			{tab === 'games' && <ChallengeFeed
				selected={selected}
				toggleSelected={actions.toggleSelected}
				uid={user.uid}
				cat={tab}/>}
			{tab === 'playlists' && <PlaylistFeed
				uid={user.uid}
				cat={tab}/>}
		</Flex>
	)
}

function reducer (state, action) {
	switch (action.type) {
		case changeTab.type: 
			return {
				...state,
				tab: action.payload
			}
		case toggleSelected.type:
			return {
				...state,
				selected: maybeAddToArray(action.payload, state.selected)
			}
		case clearSelected.type:
			return {
				...state,
				selected: []
			}
		case setPlaylists.type:
			return {
				...state,
				playlists: action.payload
			}
	}
	return state
}

function maybeAddToArray (val, arr) {
	if (arr.indexOf(val) > -1) {
		return arr.filter((item) => item !== val)
	} else {
		return arr.concat(val)
	}
}

export default {
	initialState,
	onUpdate,
	reducer,
	render
}
