import element from 'vdux/element'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import Tab from '../components/Tab'
import createAction from '@f/create-action'
import IndeterminateProgress from '../components/IndeterminateProgress'
import SelectToolbar from './SelectToolbar'
import ProfileTabs from './ProfileTabs'
import Feed from './Feed'

const changeTab = createAction('PROFILE: CHANGE_TAB')
const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')
const toggleSelectMode = createAction('PROFLIE: TOGGLE_SELECT_MODE')

const initialState = ({local}) => ({
	tab: 'playlists',
	selected: [],
	actions: {
		toggleSelected: local((key) => toggleSelected(key)),
		clearSelected: local(() => clearSelected()),
		toggleSelectMode: local(() => toggleSelectMode())
	}
})

function render ({props, state, local}) {
	const {user} = props
	const {tab, actions, selected} = state
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
					: <SelectToolbar uid={user.uid} clearSelected={actions.clearSelected} num={selected.length}/>}
			</Card>
			<Feed selected={selected} toggleSelected={actions.toggleSelected} uid={user.uid} cat={tab}/>
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

export default {
	initialState,
	reducer,
	render
}
