import IndeterminateProgress from '../components/IndeterminateProgress'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import ChallengeLoader from './ChallengeLoader'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import PlaylistFeed from './PlaylistFeed'
import ProfileTabs from './ProfileTabs'
import Tab from '../components/Tab'
import enroute from 'enroute'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'

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

const getFbProps = (uid) => ({
	games: {
    ref: `/games/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: uid},
      {method: 'limitToFirst', value: 50}
    ]
  }
})

const router = enroute({
  'games': (params, props) => <ChallengeLoader
				selected={props.selected}
				toggleSelected={props.actions.toggleSelected}
				uid={props.userKey}
				fbProps={getFbProps(props.userKey)}
				mine={props.mine}
				cat={props.tab}/>,
	'playlists': (params, props) => <PlaylistFeed
				items={props.playlists.value}
				uid={props.userKey}
				mine={props.mine}
				cat={props.tab}/>
})

function render ({props, state, local}) {
	const {playlists, user, mine, profile} = props
	const {actions, selected} = state
	const selectMode = selected.length > 0

	if (playlists.loading || profile.loading) return <IndeterminateProgress/>

	return (
    <Flex column align='start' wide tall>
			<Block relative wide color='#333' fontWeight='800'>
				<Block align='start center' pb='10px' ml='1em'>
					<Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='70px' w='70px' src={profile.value.photoURL}/>
					<Block relative ml='1em'>
						<Text display='block' fontWeight='300' fs='xs'>USER</Text>
						<Text display='block' fontWeight='500' fs='xl'>{profile.value.displayName}</Text>
					</Block>
				</Block>
				{!selectMode
					? <ProfileTabs username={props.username} tab={props.params} changeTab={local((val) => changeTab(val))} />
					: <SelectToolbar
							selected={selected}
							playlists={playlists.value}
							uid={props.userKey}
							mine={mine}
							clearSelected={actions.clearSelected}
							num={selected.length}/>}
			</Block>
			{router(props.params, {...props, ...state})}
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

export default fire((props) => ({
	profile: `/users/${props.userKey}`,
  playlists: {
  	ref: `/playlists/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: props.userKey},
      {method: 'limitToFirst', value: 50}
    ]
  }
}))({
	initialState,
	reducer,
	render
})
