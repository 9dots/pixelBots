import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import {Block, Icon, Image, Text} from 'vdux-ui'
import Button from '../components/Button'
import Level from '../components/Level'
import Card from '../components/Card'
import {createCode} from '../utils'
import element from 'vdux/element'
import fire from 'vdux-fire'


function render ({props}) {
	const {game, selected, mine, editable, toggleSelected, setModal} = props

	if (game.loading) {
		return <IndeterminateProgress/>
	}
	if (game.value === null) {
		return <div/>
	}

	const item = game.value

	const hoverOptions = (
	  <Block wide tall align='center center' column>
	  	<Button my='5px' w='100px' bgColor='green' onClick={createAssignment}>ASSIGN</Button>
	  	<Button my='5px' w='100px' bgColor='red' onClick={() => setUrl(`/games/${props.ref}`)}>PLAY</Button>
	  </Block>
	)

	function * createAssignment () {
		const code = yield createCode()
		yield refMethod({
      ref: `/links/${code}`,
      updates: {
        method: 'set',
        value: {
          type: 'game',
          payload: props.ref
        }
      }
    })
    yield setModal(code)
	}

	return (
		<Block bgColor='#f5f5f5' m='15px' relative>
			<Card
				hoverOptions={selected ? '' : hoverOptions}
				selected={selected}
				cardImage={<Image display='block' sq='150px' src={item.imageUrl}/>}
        cardTitle={item.title}>
        {
        	(mine || editable) && 
        		<Icon
		        	cursor='pointer'
		        	zIndex='10'
		        	onClick={() => toggleSelected(props.ref)}
		        	absolute
		        	color={selected ? 'blue' : 'white'}
		        	left='10px'
		        	top='10px'
		        	opacity={selected ? '1' : '0.8'}
		        	name='check_circle'/>
        }
      	<Block align='start center'>
      		<Icon mr='10px' name='keyboard'/>
      		<Text fontWeight='800'>{item.inputType}</Text>
      	</Block>
      	<Block align='start center'>
      		<Icon mr='10px' name='info_outline'/>
      		<Text fontWeight='800'>{item.animals[0].type}</Text>
      	</Block>
			</Card>
		</Block>
	)
}

export default fire((props) => ({
  game: `/games/${props.ref}`
}))({
	render
})