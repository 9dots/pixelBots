import element from 'vdux/element'
import {Block, Flex} from 'vdux-ui'
import Card from '../components/Card'

function render ({props}) {
	const {playlists} = props
	return (
		<Flex>
			{playlists.map(({name, description = '', pins = 0}) => (
				<Card
					m='15px'
					h='auto'
					w='auto'
					cursor='pointer'
					cardTitle={name}>
					<Block fontWeight='800'>
						{description}
					</Block>
					<Block>
						{pins} {pins === 1 ? 'pin' : 'pins'}
					</Block>
				</Card>
			))}
		</Flex>
	)
}

export default {
	render
}