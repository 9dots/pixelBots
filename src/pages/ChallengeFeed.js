import createAction from '@f/create-action'
import {Block, Flex, Icon, Grid, Text} from 'vdux-ui'
import {Card} from 'vdux-containers'
import GridCard from '../components/Card'
import Level from '../components/Level'
import {createNew} from '../actions'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'


function render ({props}) {
	const {games, selected = [], toggleSelected, mine} = props
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
			{reduce((cur, item, key) => cur.concat(
				<Block bgColor='#f5f5f5' m='15px' relative>
					<GridCard
						selected={selected.indexOf(key) > -1}
						cardImage={<Level
		            editMode
		            animals={[]}
		            painted={item.targetPainted}
		            levelSize='150px'
		            w='auto'
		            h='auto'
		            hideBorder
		            numRows={item.levelSize[0]}
		            numColumns={item.levelSize[1]}/>}
	          cardTitle={item.title}>
          	<Block align='start center'>
          		<Icon mr='10px' name='keyboard'/>
          		<Text fontWeight='800'>{item.inputType}</Text>
          	</Block>
          	<Block align='start center'>
          		<Icon mr='10px' name='info_outline'/>
          		<Text fontWeight='800'>{item.animals[0].type}</Text>
          	</Block>
					</GridCard>
					{mine && <Icon
						        	cursor='pointer'
						        	onClick={() => toggleSelected(key)}
						        	absolute
						        	color={selected.indexOf(key) > -1 ? 'blue' : ''}
						        	right='5px'
						        	bottom='5px'
						        	opacity={selected.indexOf(key) > -1 ? '1' : '0.5'}
						        	name='check_circle'/>}
				</Block>), [], items)}
		</Flex>
	)
}

export default {
	render
}
