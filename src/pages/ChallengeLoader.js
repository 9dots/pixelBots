import IndeterminateProgress from '../components/IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import {Block, Icon, Image, Text} from 'vdux-ui'
import Button from '../components/Button'
import Level from '../components/Level'
import Card from '../components/Card'
import {createCode} from '../utils'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import fire from 'vdux-fire'
import {getImage} from '../storage'
import createAction from '@f/create-action'

const setImage = createAction('<ChallengeLoader/>: SET_IMAGE')

const initialState = ({local}) => ({
	imageURL: '',
	actions: {
		setImage: local((url) => setImage(url))
	}
})

function * onCreate ({props, state}) {
	const {actions} = state
	const imageURL = yield getImage(props.ref)
	yield actions.setImage(imageURL)
}

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
        {
        	(mine || editable) && 
        		<Icon
		        	cursor='pointer'
		        	zIndex='9999'
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

function reducer (state, action) {
	switch (action.type) {
		case setImage.type:
			return {
				...state,
				imageURL: action.payload
			}
	}
}

export default fire((props) => ({
  game: `/games/${props.ref}`
}))({
	// initialState,
	// onCreate,
	// reducer,
	render
})