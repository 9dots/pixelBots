/** @jsx element */

import VirtualList from '../components/VirtualList'
import LinkModal from '../components/LinkModal'
import SortHeader from '../components/SortHeader'
import ChallengeLoader from './ChallengeLoader'
import {setModal, clearModal} from '../actions'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'
import {Block, Flex, Menu} from 'vdux-ui'
import Button from '../components/Button'
import flatten from 'lodash/flatten'
import {refMethod} from 'vdux-fire'
import objEqual from '@f/equal-obj'
import element from 'vdux/element'
import sort from 'lodash/orderBy'
import Window from 'vdux/window'
import chunk from 'lodash/chunk'
import map from '@f/map'

const setOrderType = createAction('<ChallengeFeed/>: SET_ORDER_TYPE')
const setOrder = createAction('<ChallengeFeed/>: SET_ORDER')
const setItems = createAction('<ChallengeFeed:> SET_ITEMS')

const caseInsensitiveName = (game) => game.name
  ? game.name.toLowerCase()
  : game.title.toLowerCase()

const initialState = ({local}) => ({
  modal: '',
  orderBy: 'lastEdited',
  order: 'desc',
  items: [],
  actions: {
    setOrder: local(setOrder),
    setOrderType: local(setOrderType),
    setItems: local(setItems)
  }
})

function * onCreate ({props, local, state}) {
  const sortedGames = sort(map((game, key) => ({...game, key}), props.games), state.orderBy, state.order)
  yield state.actions.setItems(sortedGames)
}

function * onUpdate (prev, {props, local, state}) {
  if (prev.state.orderBy !== state.orderBy || prev.state.order !== state.order || !objEqual(prev.props.games, props.games) && props.games) {
    const sortedGames = sort(map((game, key) => ({...game, key}), props.games), state.orderBy, state.order)
    yield state.actions.setItems(sortedGames)
  }
}

function render ({props, state}) {
  const {games, selected = [], mine, uid, toggleSelected} = props
  const {modal, order, actions, orderBy, items} = state

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={clearModal}>Done</Button>
    </Block>
  )

  const Challenges = ({
    props
  }) => (
    <Block h={props.virtual.style.height} {...props.virtual.style} boxSizing='border-box'>
      {props.virtual.items.map((game, i) => (
        <ChallengeLoader
          checkbox
          lastEdited={game.lastEdited}
          setModal={setModal}
          userRef={game.key}
          h={props.itemHeight}
          remove={remove}
          key={game.key}
          isSelected={selected.indexOf(game.ref) > -1}
          handleClick={toggleSelected}
          selectMode={selected.length > 0}
          uid={uid}
          mine={mine}
          ref={game.ref} />
      ))}
    </Block>
  )

  // const CVL = VirtualList(Challenges, items, {height: 67, buffer: 30, container: document.getElementById('action-bar-holder')})

  return (
    <Flex flexWrap='wrap' wide margin='0 auto'>
      <Menu
        column
        wide
        border='1px solid #e0e0e0'
        borderTopWidth='0'
        bgColor='white'
        minWidth='820px'>
        <Block borderBottom='1px solid #E0E0E0' pl='5%' pr='16px' py='8px' color='#999' fontWeight='800' align='start center' bgColor='transparent'>
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
          <VirtualList
            key='virual-list'
            innerList={Challenges}
            items={items}
            height='67'
            buffer='30'
            container={document.getElementById('action-bar-holder')} />
        </Block>
      </Menu>
      {
        modal && <LinkModal
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
  [setOrderType.type]: (state, payload) => ({...state, orderBy: payload}),
  [setOrder.type]: (state, payload) => ({...state, order: payload}),
  [setItems.type]: (state, payload) => ({...state, items: payload})
})

export default {
  initialState,
  onUpdate,
  onCreate,
  reducer,
  render
}
