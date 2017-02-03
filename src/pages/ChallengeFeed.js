/** @jsx element */

import LinkModal from '../components/LinkModal'
import SortHeader from '../components/SortHeader'
import {Block, Flex, Menu, Text} from 'vdux-ui'
import ChallengeLoader from './ChallengeLoader'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'
import {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import sort from 'lodash/orderBy'
import map from '@f/map'
import element from 'vdux/element'
import reduce from '@f/reduce'

const setModal = createAction('<ChallengeFeed/>: SET_MODAL')
const setOrderType = createAction('<ChallengeFeed/>: SET_ORDER_TYPE')
const setOrder = createAction('<ChallengeFeed/>: SET_ORDER')

const caseInsensitiveName = (game) => game.name
  ? game.name.toLowerCase()
  : game.title.toLowerCase()

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
  const {games, selected = [], mine, uid, toggleSelected} = props
  const {modal, order, actions, orderBy} = state

  const sortedGames = sort(map((game, key) => ({...game, key}), games), orderBy, order)

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
    </Block>
	)

  return (
    <Flex flexWrap='wrap' wide margin='0 auto'>
      <Menu
        column
        wide
        minWidth='820px'>
        <Block pl='5%' pr='16px' py='8px' color='#999' fontWeight='800' align='start center' bgColor='transparent'>
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
        <Block>
          {sortedGames.map((game, i) => (
            <ChallengeLoader
              lastEdited={game.lastEdited}
              setModal={actions.setModal}
              userRef={game.key}
              remove={remove}
              key={game.key}
              selected={selected}
              handleClick={toggleSelected}
              uid={uid}
              mine={mine}
              ref={game.ref} />
          ))}
        </Block>
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

function * remove (uid, ref) {
  yield refMethod({
    ref: `/users/${uid}/games/${ref}`,
    updates: {
      method: 'remove'
    }
  })
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
