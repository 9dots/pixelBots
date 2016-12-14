import element from 'vdux/element'
import {Block, Flex, Text} from 'vdux-ui'
import Card from '../components/Card'
import {setUrl} from 'redux-effects-location'
import reduce from '@f/reduce'

function render ({props}) {
	const {playlists} = props

	return (
		<Flex wide flexWrap='wrap'>
			{reduce((cur, playlist, key) => cur.concat(
				<Card
					m='15px'
					h='150px'
					w='192px'
					onClick={() => setUrl(`/playlist/${playlist.ref}`)}
					cursor='pointer'
					cardFooter={getCardFooter(playlist)}
					cardTitle={playlist.name}>
					<Block mt='-10px' fontWeight='800' fs='xxs'>
						{playlist.creatorUsername.toUpperCase()}
					</Block>
					<Block py='10px' fontWeight='500'>
						{playlist.description}
					</Block>
				</Card>
			), [], playlists)}
		</Flex>
	)
}

function getCardFooter (playlist) {
	return (
		<Block p='10px' align='space-between'>
			<Text fs='xxs'>
				{playlist.follows || 0} FOLLOWS
			</Text>
		</Block>
	)
}

export default {
	render
}