import PlaylistItem from '../components/PlaylistItem'
import {Block, Menu, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props}) {
	const {playlist} = props
	const {sequence, name} = playlist

	return (
		<Block flex ml='10px'>
			<Block p='10px'>
				<Text display='block' fs='xs' color='#777' fontWeight='300'>PLAYLIST</Text>
				<Text display='block' fs='xxl' color='#555' fontWeight='500'>{name}</Text>
			</Block>
			<Menu overflowY='auto' column>
				{sequence.map((challenge) => <PlaylistItem ref={challenge}/>)}
			</Menu>
		</Block>
	)
}

export default {
	render
}