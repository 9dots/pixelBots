import Description from '../components/Description'
import {Block, Flex, Icon, Text} from 'vdux-ui'
import Layout from '../layouts/HeaderAndBody'
import {setUrl} from 'redux-effects-location'
import Loading from '../components/Loading'
import Button from '../components/Button'
import Solutions from './Solutions'
import element from 'vdux/element'
import fire from 'vdux-fire'

function render ({props}) {
	const {project} = props
	if (project.loading) return <Loading/>
	const game = project.value
	const navigation = [
		{title: game.title, category: 'challenge'}
	]
	const titleActions = (
		<Flex>
			<Button onClick={() => setUrl(`/play/${props.gameRef}`)} align='space-between' bgColor='blue'>
				<Icon ml='-6px' mr='8px' name='play_arrow'/>
				<Text>PLAY</Text>
			</Button>
		</Flex>
	)
	return (
		<Layout
			title={game.title}
			titleImg={game.imageUrl}
			navigation={navigation}
			titleActions={titleActions}>
			<Block m='20px'>
				<Block p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
					<Text color='#666' display='block' fs='m'>Description:</Text>
					{
						game.description
							? <Description wide mt='10px' content={game.description}/>
							: <Text display='block' myt='15px'>This game does not have a description yet.</Text>
					}
				</Block>
				<Block my='1em' p='15px' wide bgColor='white' border='1px solid #e0e0e0'>
					<Text color='#666' display='block' fs='m'>Solutions:</Text>
					<Solutions gameRef={props.gameRef}/>
				</Block>
			</Block>
		</Layout>
	)
}

export default fire((props) => ({
	project: `/games/${props.gameRef}`
}))({
	render
})