import Tab from '../components/Tab'
import element from 'vdux/element'
import {Block, Flex} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'

function render ({props}) {
	const {changeTab, tab, username} = props
	return (
		<Flex borderBottom='1px solid #999' wide relative bottom='0' color='lightBlue' h='42px'>
			<Tab
				name='challenges'
				fs='s'
				relative
				bgColor='#f5f5f5'
				lineHeight='2.6em'
				active={tab === 'games'}
				fontWeight='800'
				highlight='false'
				color={tab === 'games' ? '#333' : '#666'}
				hoverProps={tab !== 'games' && {color: '#666'}}
				p='0'
				handleClick={() => setUrl(`/${username}/games`)}>
				{tab === 'games' && <Block absolute bgColor='red' wide  bottom='-1px' h='6px'/>}
			</Tab>
			<Tab
				name='playlists'
				fs='s'
				relative
				bgColor='#f5f5f5'
				lineHeight='2.6em'
				active={tab === 'playlists'}
				fontWeight='800'
				highlight='false'
				color={tab === 'playlists' ? '#333' : '#666'}
				hoverProps={tab !== 'playlists' && {color: '#666'}}
				p='0'
				handleClick={() => setUrl(`/${username}/playlists`)}>
				{tab === 'playlists' && <Block absolute bgColor='lightBlue' wide  bottom='-1px' h='6px'/>}
			</Tab>
			<Tab
				name='assignments'
				fs='s'
				relative
				bgColor='#f5f5f5'
				lineHeight='2.6em'
				active={tab === 'assignments'}
				fontWeight='800'
				highlight='false'
				color={tab === 'assignments' ? '#333' : '#666'}
				hoverProps={tab !== 'assignments' && {color: '#666'}}
				p='0'
				handleClick={() => setUrl(`/${username}/assignments`)}>
				{tab === 'assignments' && <Block absolute bgColor='yellow' wide  bottom='-1px' h='6px'/>}
			</Tab>
		</Flex>
	)
}

export default {
	render
}