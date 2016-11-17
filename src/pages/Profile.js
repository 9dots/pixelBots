import IndeterminateProgress from '../components/IndeterminateProgress'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import ChallengeFeed from './ChallengeFeed'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import PlaylistFeed from './PlaylistFeed'
import ProfileTabs from './ProfileTabs'
import Tab from '../components/Tab'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'

const changeTab = createAction('PROFILE: CHANGE_TAB')
const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')
const toggleSelectMode = createAction('PROFLIE: TOGGLE_SELECT_MODE')

const initialState = ({local}) => ({
	tab: 'games',
	selected: [],
	actions: {
		toggleSelected: local((key) => toggleSelected(key)),
		clearSelected: local(() => clearSelected()),
		toggleSelectMode: local(() => toggleSelectMode())
	}
})

function render ({props, state, local}) {
	const {playlists, user, mine} = props
	const {tab, actions, selected} = state
	const selectMode = selected.length > 0
	if (playlists.loading) return <IndeterminateProgress/>

	return (
    <Flex p='20px' relative left='60px' column align='start' minHeight='100%' w='96%'>
			<Block relative wide color='#333' fontWeight='800'>
				<Block align='start center' pb='10px' ml='1em'>
					<Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='70px' w='70px' src={user.photoURL}/>
					<Block relative ml='1em'>
						<Text display='block' fontWeight='300' fs='xs'>USER</Text>
						<Text display='block' fontWeight='500' fs='xl'>{user.displayName}</Text>
					</Block>
				</Block>
				{!selectMode
					? <ProfileTabs tab={tab} changeTab={local((val) => changeTab(val))} />
					: <SelectToolbar
							selected={selected}
							playlists={playlists.value}
							uid={user.uid}
							mine={mine}
							clearSelected={actions.clearSelected}
							num={selected.length}/>}
			</Block>
			{tab === 'games' && <ChallengeFeed
				selected={selected}
				toggleSelected={actions.toggleSelected}
				uid={user.uid}
				mine={mine}
				cat={tab}/>}
			{tab === 'playlists' && <PlaylistFeed
				items={playlists.value}
				uid={user.uid}
				mine={mine}
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

export default fire((props) => ({
  playlists: {
  	ref: `/playlists/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: props.user.uid},
      {method: 'limitToFirst', value: 50}
    ]
  }
}))({
	initialState,
	reducer,
	render
})
