import IndeterminateProgress from '../components/IndeterminateProgress'
import {Block, Card, Flex, Menu, Icon, Grid, Text} from 'vdux-ui'
import CreatePlaylist from '../components/CreatePlaylist'
import createAction from '@f/create-action'
import PlaylistView from './PlaylistView'
import {MenuItem} from 'vdux-containers'
import Level from '../components/Level'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import reduce from '@f/reduce'
import fire from 'vdux-fire'

const selectActiveAssignment = createAction('<AssignmentFeed/>: selectActiveAssignment')

const initialState = ({props, local}) => ({
	active: Object.keys(props.assignments)[0],
	actions: {
		selectActiveAssignment: local((val) => selectActiveAssignment(val))
	}
})

function render ({props, state, local}) {
	const {assignments, mine, uid} = props
	const {actions, active, modal} = state

	if (assignments.loading) {
		return <IndeterminateProgress/>
	}

	if (assignments.value === null) {
		return <div>No assignments found.</div>
	}

	return (
		<Flex wide>
			<Menu column spacing='2px' mt='2px' maxHeight='calc(100vh - 142px)' overflowY='auto'>
			{mine && <MenuItem
							bgColor='#d5d5d5'
							align='start center'
							relative
							w='300px'
							onClick={actions.setModal}
							p='20px'
							color='#333'>
							<Icon name='add' mr='1em'/>
			        <Text fs='m' fontWeight='300'>New Playlist</Text>
			</MenuItem>}
			{reduce((cur, item, key) => cur.concat(
				<MenuItem
					bgColor='#d5d5d5'
					relative
					w='300px'
					highlight={active === key}
					p='20px'
					onClick={() => actions.selectActiveAssignment(key)}
					color='#333'>
	          <Text fs='m' fontWeight='300'>{item.name}</Text>
				</MenuItem>), [], assignments.value)}
			</Menu>
			<PlaylistView mine={mine} activeKey={active} playlist={assignments[active]}/>
		</Flex>
	)
}

function reducer (state, action) {
	switch (action.type) {
		case selectActiveAssignment.type:
			return {
				...state,
				active: action.payload
			}
	}
	return state
}

export default fire((props) => ({
  assignments: {
  	ref: `/assignments/`,
    updates: [
      {method: 'orderByChild', value: 'creatorID'},
      {method: 'equalTo', value: props.uid},
      {method: 'limitToFirst', value: 50}
    ]
  }
}))({
	initialState,
	reducer,
	render
})