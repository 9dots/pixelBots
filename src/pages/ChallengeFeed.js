import LinkModal from '../components/LinkModal'
import {Block, Flex, Icon, Grid, Text} from 'vdux-ui'
import ChallengeLoader from './ChallengeLoader'
import createAction from '@f/create-action'
import {Card, Input} from 'vdux-containers'
import fire, {refMethod} from 'vdux-fire'
import GridCard from '../components/Card'
import Button from '../components/Button'
import Level from '../components/Level'
import {createNew} from '../actions'
import element from 'vdux/element'
import reduce from '@f/reduce'

const setModal = createAction('<ChallengeFeed/>: SET_MODAL')

const initialState = ({local}) => ({
	modal: '',
	actions: {
		setModal: local(setModal)
	}
})

function render ({props, state}) {
	const {games, editable, selected = [], toggleSelected, mine} = props
	const {modal, actions} = state
	const items = games

	const modalFooter = (
		<Block>
			<Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
		</Block>
	)

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
							onClick={() => createNew(props.uid)}
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
						setModal={actions.setModal}
						ref={next.ref}
						toggleSelected={toggleSelected}/>
				), [], games)
			}
			{modal && <LinkModal
				code={modal}
				footer={modalFooter}/>
			}
		</Flex>
	)
}

function reducer (state, action) {
	switch (action.type) {
		case setModal.type:
			return {
				...state,
				modal: action.payload
			}
	}
	return state
}

export default {
	initialState,
	reducer,
	render
}
