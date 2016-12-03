import IndeterminateProgress from '../components/IndeterminateProgress'
import {Block, Icon, Text} from 'vdux-ui'
import Level from '../components/Level'
import Card from '../components/Card'
import element from 'vdux/element'
import fire from 'vdux-fire'

function render ({props}) {
	const {game, selected, mine, editable, toggleSelected} = props
	if (game.loading) {
		return <IndeterminateProgress/>
	}
	const item = game.value
	return (
		<Block bgColor='#f5f5f5' m='15px' relative>
			<Card
				selected={selected}
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
			</Card>
			{
				(mine || editable) && <Icon
				        	cursor='pointer'
				        	onClick={() => toggleSelected(props.ref)}
				        	absolute
				        	color={selected ? 'blue' : ''}
				        	right='5px'
				        	bottom='5px'
				        	opacity={selected ? '1' : '0.5'}
				        	name='check_circle'/>
			}
		</Block>
	)
}

export default fire((props) => ({
  game: `/games/${props.ref}`
}))({
	render
})