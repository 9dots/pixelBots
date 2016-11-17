import IndeterminateProgress from '../components/IndeterminateProgress'
import createAction from '@f/create-action'
import {Block, Card, Icon, Grid, Text} from 'vdux-ui'
import Level from '../components/Level'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'

const doneLoading = createAction('FEED: DONE_LOADING')
const toggleLoading = createAction('FEED: TOGGLE_LOADING')
const setCards = createAction('FEED: SET_CARDS')


function render ({props, state, local}) {
	const {games, selected, toggleSelected, mine} = props
	if (games.loading) {
		return <IndeterminateProgress/>
	}
	const items = games.value
	return (
		<Grid itemsPerRow='4'>
			{reduce((cur, item, key) => cur.concat(
				<Block bgColor='#f5f5f5' m='15px' relative>
					<Card
						transform={selected.indexOf(key) > -1 ? 'scale3d(0.75, 0.81, 1)' : ''}
						transition='transform .1s ease-in-out'
						relative
						p='20px'
						color='#333'>
						<Level
	            editMode
	            animals={[]}
	            painted={item.targetPainted}
	            levelSize='150px'
	            w='auto'
	            h='auto'
	            numRows={item.levelSize[0]}
	            numColumns={item.levelSize[1]}/>
	          <Block mt='15px' column align='center center'>
		          <Block mb='10px'>
		          	<Text fs='m' fontWeight='300'>{item.title}</Text>
		          </Block>
		          <Block fs='s'>
		          	<Block align='start center'>
		          		<Icon mr='10px' name='keyboard'/>
		          		<Text fontWeight='800'>{item.inputType}</Text>
		          	</Block>
		          	<Block align='start center'>
		          		<Icon mr='10px' name='info_outline'/>
		          		<Text fontWeight='800'>{item.animals[0].type}</Text>
		          	</Block>
		          </Block>
	          </Block>
					</Card>
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
		</Grid>
	)
}

export default fire((props) => ({
  games: {
    ref: `/games/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: props.uid},
      {method: 'limitToFirst', value: 50}
    ]
  }
}))({
	render
})
