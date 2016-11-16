import element from 'vdux/element'
import {Avatar, Block, Card, Flex, Image, Text} from 'vdux-ui'
import Tab from '../components/Tab'
import createAction from '@f/create-action'
import IndeterminateProgress from '../components/IndeterminateProgress'
import Feed from './Feed'

const changeTab = createAction('PROFILE: CHANGE_TAB')

const initialState = () => ({tab: 'playlists'})

function render ({props, state, local}) {
	const {user} = props
	const {tab} = state
	if (!user.uid) return <IndeterminateProgress/>

	return (
    <Flex py='20px' relative m='0 auto' column align='start center' minHeight='100%' w='96%'>
			<Card relative w='80%' bgColor='lightBlue' color='white' fontWeight='800'>
				<Block align='start center' p='20px'>
					<Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='80px' w='80px' src={user.photoURL || user.providerData[0].photoURL}/>
					<Block ml='1em'>
						<Text fs='l'>{user.displayName || user.providerData[0].displayName}</Text>
					</Block>
				</Block>
				<Flex bgColor='#f5f5f5' wide relative bottom='0' align='space-around' color='lightBlue' pt='10px' h='60px'>
				<Tab
					name='playlists'
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'playlists'}
					fontWeight='300'
					highlight='false'
					hoverProps={tab !== 'playlists' && {color: '#666'}}
					p='0'
					handleClick={local(() => changeTab('playlists'))}>
					{tab === 'playlists' && <Block absolute bgColor='green' wide  bottom='0' h='6px'/>}
				</Tab>
				<Tab
					name='games'
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'games'}
					fontWeight='300'
					highlight='false'
					hoverProps={tab !== 'games' && {color: '#666'}}
					p='0'
					handleClick={local(() => changeTab('games'))}>
					{tab === 'games' && <Block absolute bgColor='red' wide  bottom='0' h='6px'/>}
				</Tab>
				<Tab
					name='drafts'
					fs='s'
					relative
					bgColor='#f5f5f5'
					lineHeight='2.6em'
					active={tab === 'drafts'}
					fontWeight='300'
					highlight='false'
					hoverProps={tab !== 'drafts' && {color: '#666'}}
					p='0'
					handleClick={local(() => changeTab('drafts'))}>
					{tab === 'drafts' && <Block absolute bgColor='yellow' wide  bottom='0' h='6px'/>}
				</Tab>
				</Flex>
			</Card>
			<Feed uid={user.uid} cat={tab}/>
		</Flex>
	)
}

function reducer (state, action) {
	if (action.type === changeTab.type) {
		return {
			...state,
			tab: action.payload
		}
	}
	return state
}

export default {
	initialState,
	reducer,
	render
}
