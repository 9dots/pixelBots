/** @jsx element */

import LinkModal from '../components/LinkModal'
import SortHeader from '../components/SortHeader'
import {Block, Flex, Menu} from 'vdux-ui'
import ChallengeLoader from './ChallengeLoader'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'
import {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import Window from 'vdux/window'
import sort from 'lodash/orderBy'
import flatten from 'lodash/flatten'
import chunk from 'lodash/chunk'
import map from '@f/map'
import element from 'vdux/element'

const setModal = createAction('<ChallengeFeed/>: SET_MODAL')
const setOrderType = createAction('<ChallengeFeed/>: SET_ORDER_TYPE')
const setOrder = createAction('<ChallengeFeed/>: SET_ORDER')
const setCurrentlyVisible = createAction('<ChallengeFeed/>: SET_CURRENTLY_VISIBLE')
const setChunks = createAction('<ChallengeFeed/>: SET_CHUNKS')
const setCurrentChunk = createAction('<ChallengeFeed/>: SET_CURRENT_CHUNKS')
const addCurrentlyVisible = createAction('<ChallengeFeed/>: ADD_CURRENTLY_VISIBLE')

const caseInsensitiveName = (game) => game.name
  ? game.name.toLowerCase()
  : game.title.toLowerCase()

const initialState = ({local}) => ({
  modal: '',
  orderBy: 'lastEdited',
  order: 'desc',
  currentlyVisible: [],
  chunks: [],
  actions: {
    setOrder: local(setOrder),
    setModal: local(setModal),
    setOrderType: local(setOrderType),
    setChunks: local(setChunks),
    setCurrentlyVisible: local(setCurrentlyVisible),
    setCurrentChunk: local(setCurrentChunk),
    addCurrentlyVisible: local(addCurrentlyVisible)
  }
})

function * onCreate ({props, local, state}) {
  const sortedGames = sort(map((game, key) => ({...game, key}), props.games), state.orderBy, state.order)
  const chunks = chunk(sortedGames, 20)
  yield state.actions.setChunks(chunks)
  yield state.actions.setCurrentlyVisible(chunks[0])
  yield state.actions.setCurrentChunk(0)
}

function * onUpdate (prev, {props, local, state}) {
  if (prev.state.orderBy !== state.orderBy || prev.state.order !== state.order) {
    const sortedGames = sort(map((game, key) => ({...game, key}), props.games), state.orderBy, state.order)
    const chunks = chunk(sortedGames, 20)
    if (prev.state.chunk !== chunks.length - 1) {
      yield state.actions.setChunks(chunks)
      yield state.actions.setCurrentChunk(0)
      yield state.actions.setCurrentlyVisible(chunks[0])
    } else {
      yield state.actions.setCurrentlyVisible(flatten(chunks))
    }
  }
}

function render ({props, state}) {
  const {games, selected = [], mine, uid, toggleSelected} = props
  const {modal, order, actions, orderBy, currentlyVisible, chunks, chunk} = state

  const modalFooter = (
    <Block>
      <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
    </Block>
	)

  return (
    <Window onScroll={maybeAddChunk}>
      <Flex flexWrap='wrap' wide margin='0 auto' px='10px'>
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
            {currentlyVisible.map((game, i) => (
              <ChallengeLoader
                checkbox
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
        {
          modal && <LinkModal
            code={modal}
            footer={modalFooter} />
  			}
      </Flex>
    </Window>
  )

  function * maybeAddChunk (e) {
    const scrollHeight = e.target.scrollHeight
    const scroll = e.target.scrollTop + e.target.offsetHeight + 200
    if (Math.floor(scroll / scrollHeight) >= 1 && chunk < chunks.length - 1) {
      yield state.actions.setCurrentChunk(chunk + 1)
      yield state.actions.addCurrentlyVisible(chunks[chunk+1])
    }
  }

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
  [setOrder.type]: (state, payload) => ({...state, order: payload}),
  [addCurrentlyVisible.type]: (state, payload) => ({...state, currentlyVisible: state.currentlyVisible.concat(...payload)}),
  [setChunks.type]: (state, payload) => ({...state, chunks: payload}),
  [setCurrentChunk.type]: (state, num) => ({...state, chunk: num}),
  [setCurrentlyVisible]: (state, payload) => ({...state, currentlyVisible: payload})
})

export default {
  initialState,
  onUpdate,
  onCreate,
  reducer,
  render
}
