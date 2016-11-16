import IndeterminateProgress from '../components/IndeterminateProgress'
import createAction from '@f/create-action'
import {Block, Card, Icon, Grid, Text} from 'vdux-ui'
import Level from '../components/Level'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'

const doneLoading = createAction('FEED: DONE_LOADING')
const toggleLoading = createAction('FEED: TOGGLE_LOADING')
const setCards = createAction('FEED: SET_CARDS')

const initialState = ({local}) => ({
	loading: true,
	cards: [],
	actions: {
		setTheCards: local((items) => setCards(items)),
		lToggleLoading: local(() => doneLoading())
	}
})

function * onCreate ({state, props}) {
	const {setTheCards, lToggleLoading} = state.actions
	const items = yield refMethod({
    ref: `/${props.cat}/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: props.uid},
      {method: 'limitToFirst', value: 50},
      {method: 'once', value: 'value'}
    ]
  })
	yield setTheCards(items.val())
	yield lToggleLoading()
}

function * onUpdate (prev, {props, state}) {
	if (prev.props.uid !== props.uid || prev.props.cat !== props.cat) {
		const {setTheCards, lToggleLoading} = state.actions
		const items = yield refMethod({
	    ref: `/${props.cat}/`,
	    updates: [
	      {method: 'orderByChild', value: 'creatorID'},
	      {method: 'equalTo', value: props.uid},
	      {method: 'limitToFirst', value: 50},
	      {method: 'once', value: 'value'}
	    ]
	  })
		yield setTheCards(items.val())
  	yield lToggleLoading()
  }
}

function render ({props, state}) {
	const {items, loading} = state
	if (loading) {
		return <IndeterminateProgress/>
	}
	return (
		<Grid itemsPerRow='3'>
			{reduce((cur, item) => cur.concat(
				<Card p='20px' m='15px' color='#333'>
					<Level
            editMode
            animals={[]}
            painted={item.targetPainted}
            levelSize='250px'
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
				</Card>), [], items)}
		</Grid>
	)
}

function reducer (state, action) {
	switch (action.type) {
		case setCards.type:
			return {
				...state,
				items: action.payload
			}
		case doneLoading.type: 
			return {
				...state,
				loading: false
			}
	}
	return state
}

export default {
	initialState,
	onUpdate,
	onCreate,
	reducer,
	render
}
