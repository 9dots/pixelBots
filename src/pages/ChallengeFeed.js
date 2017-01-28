/** @jsx element */

import LinkModal from '../components/LinkModal'
import SortHeader from '../components/SortHeader'
import {Block, Flex, Icon, Menu, Text} from 'vdux-ui'
import ChallengeLoader from './ChallengeLoader'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'
import fire, {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import {createNew} from '../actions'
import sort from 'lodash/orderBy'
import element from 'vdux/element'
import reduce from '@f/reduce'
import moment from 'moment'

const setModal = createAction('<ChallengeFeed/>: SET_MODAL')
const setOrderType = createAction('<ChallengeFeed/>: SET_ORDER_TYPE')
const setOrder = createAction('<ChallengeFeed/>: SET_ORDER')

const caseInsensitiveName = (game) => game.name.toLowerCase()
const initialState = ({local}) => ({
  modal: '',
  orderBy: caseInsensitiveName,
  order: 'asc',
  actions: {
    setOrder: local(setOrder),
    setModal: local(setModal),
    setOrderType: local(setOrderType)
  }
})


function render ({props, state}) {
  const {games, editable, selected = [], toggleSelected, mine} = props
  const {modal, order, actions, orderBy} = state

  const sortedGames = sort(games, orderBy, order)

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
    </Block>
	)

  return (
    <Flex flexWrap='wrap'	w='80%'	margin='0 auto'>
      <Menu
				column
				wide
        minWidth='820px'
				mt='2em'>
        <Block px='16px' color='#999' mt='1em' fontWeight='800' align='start center' bgColor='transparent' mb='4px'>
          <SortHeader
            onClick={() => handleClick(caseInsensitiveName)}
            minWidth='250px'
						flex
						dir={orderBy === caseInsensitiveName && order}
            label='NAME' />
          <SortHeader
            onClick={() => handleClick('animal')}
						dir={orderBy === 'animal' && order}
            minWidth='180px'
            w='180px'
            label='ANIMAL' />
          <SortHeader
            onClick={() => handleClick('inputType')}
						dir={orderBy === 'inputType' && order}
            minWidth='180px'
            w='180px'
            label='CODE TYPE' />
					<SortHeader
						onClick={() => handleClick('lastEdited')}
						dir={orderBy === 'lastEdited' && order}
            minWidth='180px'
            w='180px'
            label='LAST EDITED' />
        </Block>
        {reduce((arr, game) => arr.concat(<ChallengeLoader lastEdited={moment(game.lastEdited).fromNow()} ref={game.ref} />), [], sortedGames)}
      </Menu>
      {modal && <LinkModal
        code={modal}
        footer={modalFooter} />
			}
    </Flex>
  )

  function * handleClick (cat) {
    if (orderBy === cat) {
      const newOrder = order === 'asc' ? 'desc' : 'asc'
      yield actions.setOrder(newOrder)
    } else {
      yield actions.setOrderType(cat)
    }
  }
}

const reducer = handleActions({
  [setModal.type]: (state, payload) => ({...state, modal: payload}),
  [setOrderType.type]: (state, payload) => ({...state, orderBy: payload}),
  [setOrder.type]: (state, payload) => ({...state, order: payload})
})

export default {
  initialState,
  reducer,
  render
}
