import createAction from '@f/create-action'
import {Block, Flex, Icon, Grid, Text} from 'vdux-ui'
import {Card} from 'vdux-containers'
import GridCard from '../components/Card'
import Level from '../components/Level'
import ChallengeLoader from './ChallengeLoader'
import {createNew} from '../actions'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'


function render ({props}) {
	const {games, editable, selected = [], toggleSelected, mine} = props
	const items = games

	return (
		<Flex maxHeight='calc(100vh - 142px)' flexWrap='wrap'>
			{
				mine && <Block m='15px' relative>
					<Block
						w='192px'
						h='288px'
						border='2px dashed #666'
						column
						align='center center'
						p='20px'
						color='#666'>
						<Text fs='m' fontWeight='500' textAlign='center'>Create New Challenge</Text>
						<Card
							cursor='pointer'
							hoverProps={{bgColor: '#f5f5f5'}}
							onClick={createNew}
							transition='background .1s ease-in-out'
							mt='1em'
							circle='40px'
							bgColor='#fff'
							align='center center'>
							<Icon color='#666' name='add'/>
						</Card>
					</Block>
				</Block>
			}
			{
				reduce((cur, next, key) => cur.concat(
					<ChallengeLoader
						mine={mine}
						selected={selected.indexOf(next.ref) > -1}
						editable={editable}
						ref={next.ref}
						toggleSelected={toggleSelected}/>
				), [], games)
			}
		</Flex>
	)
}

export default {
	render
}
