import Tab from '../components/Tab'
import element from 'vdux/element'
import {Block, Flex} from 'vdux-ui'

function render ({props}) {
	const {changeTab, tab} = props
	return (
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
				handleClick={() => changeTab('playlists')}>
				{tab === 'playlists' && <Block absolute bgColor='lightBlue' wide  bottom='0' h='6px'/>}
			</Tab>
			<Tab
				name='challenges'
				fs='s'
				relative
				bgColor='#f5f5f5'
				lineHeight='2.6em'
				active={tab === 'games'}
				fontWeight='300'
				highlight='false'
				hoverProps={tab !== 'games' && {color: '#666'}}
				p='0'
				handleClick={() => changeTab('games')}>
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
				handleClick={() => changeTab('drafts')}>
				{tab === 'drafts' && <Block absolute bgColor='yellow' wide  bottom='0' h='6px'/>}
			</Tab>
		</Flex>
	)
}

export default {
	render
}