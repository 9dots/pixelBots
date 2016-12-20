import IndeterminateProgress from '../components/IndeterminateProgress'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import AssignmentFeed from './AssignmentFeed'
import ChallengeFeed from './ChallengeFeed'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import fire, {refMethod} from 'vdux-fire'
import PlaylistFeed from './PlaylistFeed'
import ProfileTabs from './ProfileTabs'
import Tab from '../components/Tab'
import element from 'vdux/element'
import filter from '@f/filter'
import enroute from 'enroute'

const changeTab = createAction('PROFILE: CHANGE_TAB')
const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')
const toggleSelectMode = createAction('PROFLIE: TOGGLE_SELECT_MODE')

const initialState = ({local}) => ({
	selected: [],
	actions: {
		toggleSelected: local((key) => toggleSelected(key)),
		clearSelected: local(() => clearSelected()),
		toggleSelectMode: local(() => toggleSelectMode())
	}
})

const router = enroute({
  'games': (params, props) => <ChallengeFeed
				selected={props.selected}
				toggleSelected={props.actions.toggleSelected}
				uid={props.userKey}
				games={props.profile.games}
				mine={props.mine}
				cat={props.tab}/>,
	'playlists': (params, props) => <PlaylistFeed
				playlists={props.profile.playlists}
				uid={props.userKey}
				mine={props.mine}
				cat={props.tab}/>,
	'assignments': (params, props) => <AssignmentFeed
				mine={props.mine}
				uid={props.userKey}
				cat={props.tab}/>
})

function render ({props, state, local}) {
	const {user, mine, thisProfile, currentUser, myProfile} = props
	const {actions, selected} = state
	const selectMode = selected.length > 0

	const profile = mine ? myProfile : thisProfile.value

	if (!profile || !currentUser) return <IndeterminateProgress/>

	const {playlists} = profile

	return (
    <Flex column align='start' wide tall>
			<Block relative wide color='#333' fontWeight='800'>
				<Block align='start center' pb='10px' ml='1em'>
					<Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='70px' w='70px' src={profile.photoURL}/>
					<Block relative ml='1em'>
						<Text display='block' fontWeight='300' fs='xs'>USER</Text>
						<Text display='block' fontWeight='500' fs='xl'>{profile.displayName}</Text>
					</Block>
				</Block>
				{!selectMode
					? <ProfileTabs username={props.username} tab={props.params} changeTab={local((val) => changeTab(val))} />
					: <SelectToolbar
							selected={selected}
							playlists={filter((playlist) => playlist.creatorID === currentUser.uid, playlists)}
							uid={props.userKey}
							mine={mine}
							clearSelected={actions.clearSelected}
							num={selected.length}/>}
			</Block>
			<Block maxHeight='calc(100% - 102px)' wide tall>
				{router(props.params, {...props, ...state, profile})}
			</Block>
		</Flex>
	)
}

function reducer (state, action) {
	switch (action.type) {
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

function getProps (props, context) {
	return {
		...props,
		myProfile: context.profile
	}
}

export default fire((props) => ({
	thisProfile: `/users/${props.userKey}`
}))({
	initialState,
	getProps,
	reducer,
	render
})
