import IndeterminateProgress from '../components/IndeterminateProgress'
import createAction from '@f/create-action'
import {Block, Card, Icon, Grid, Text} from 'vdux-ui'
import Level from '../components/Level'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'

const doneLoading = createAction('PLAYLIST FEED: DONE_LOADING')
const toggleLoading = createAction('PLAYLIST FEED: TOGGLE_LOADING')
const setCards = createAction('PLAYLIST FEED: SET_CARDS')

const initialState = ({local}) => ({
	loading: true,
	cards: [],
	selected: [],
	actions: {
		setTheCards: local((items) => setCards(items)),
		lToggleLoading: local(() => doneLoading()),
	}
})

function * onCreate ({state, props}) {
	const {setTheCards, lToggleLoading} = state.actions
	const items = yield refMethod({
    ref: `/playlists/`,
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

function render ({props, state, local}) {
	const {items, loading} = state
	if (loading) {
		return <IndeterminateProgress/>
	}
	return (
		<Grid itemsPerRow='3'>
			{reduce((cur, item, key) => cur.concat(
				<Block bgColor='#f5f5f5' m='15px' relative>
					<Card
						relative
						p='20px'
						color='#333'>
	          <Block mt='15px' column align='center center'>
		          <Block mb='10px'>
		          	<Text fs='m' fontWeight='300'>{item.name}</Text>
		          </Block>
		          <Block fs='s'>
		          	{item.sequence.map((elem) => <Block><Text>{elem}</Text></Block>)}
		          </Block>
	          </Block>
					</Card>
				</Block>), [], items)}
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
	onCreate,
	reducer,
	render
}
