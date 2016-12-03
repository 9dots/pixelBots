import ProfileTab from '../components/ProfileTab'
import element from 'vdux/element'
import {Block, Flex} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'

function render ({props}) {
	const {changeTab, tab, username} = props
	return (
		<Flex borderBottom='1px solid #999' wide relative bottom='0' color='lightBlue' h='42px'>
			<ProfileTab
				title='challenges'
				active={tab === 'games'}
				underlineColor='red'
				handleClick={() => setUrl(`/${username}/games`)}/>
			<ProfileTab
				title='playlists'
				active={tab === 'playlists'}
				underlineColor='lightBlue'
				handleClick={() => setUrl(`/${username}/playlists`)}/>
		</Flex>
	)
}

export default {
	render
}

// <ProfileTab
// 	title='assignments'
// 	active={tab === 'assignments'}
// 	underlineColor='yellow'
// 	handleClick={() => setUrl(`/${username}/assignments`)}/>