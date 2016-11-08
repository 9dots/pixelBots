/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {initializeGame} from '../actions'
import {once} from 'vdux-fire'
import Output from '../components/Output'
import createAction from '@f/create-action'

const changeTab = createAction('CHANGE_TAB')
const setDoneLoading = createAction('SET_DONE_LOADING')

function initialState ({props, local}) {
  return {
    tab: 'target',
    loading: true,
    actions: {
      tabChanged: local((name) => changeTab(name)),
      loadingDone: local(() => setDoneLoading())
    }
  }
}

function * onCreate ({props, local, state}) {
  const {loadingDone} = state.actions
  var {gameID, saveID} = props
  if (saveID) {
    const saveGame = yield once({ref: `/saved/${saveID}`})
    var {animals, gameID} = saveGame.val()
  }
  const playSnapshot = yield once({ref: `/play/${gameID}`})
  const gameCode = playSnapshot.val()
  const gameSnapshot = yield once({ref: `/games/${gameCode}`})
  const game = gameSnapshot.val()
  if (!animals) {
    var {animals} = game
  }
  yield initializeGame({...game, animals})
  yield loadingDone()
}

function render ({props, state, local}) {
  const {
    selectedLine,
    activeLine,
    running,
    active,
    hasRun,
    message,
    game,
    left
  } = props

  if (!game.animals || game.animals.length === 0) {
    return <div>loading...</div>
  }

  const {
    inputType,
    animals
  } = game

  const {tab, actions, loading} = state
  const {tabChanged} = actions
  const size = '400px'

  if (loading) {
    return <div>loading...</div>
  }

  console.log('render')

  return (
    <Block bgColor='#e5e5e5' relative w='calc(100% - 60px)' tall left={left}>
      <Block
        relative
        display='flex'
        left='0'
        minHeight='100%'
        h='100%'
        wide>
        <Output
          handleTabClick={tabChanged}
          tabs={['target', 'actual']}
          tab={tab}
          size={size}
          {...game}
          {...props}/>
        <Controls
          onRun={local(() => changeTab('actual'))}
          selectedLine={selectedLine}
          activeLine={activeLine}
          inputType={inputType}
          running={running}
          hasRun={hasRun}
          active={active}
          animals={animals}/>
      </Block>
      {message && <ModalMessage
        header={message.header}
        body={message.body}lineNumber={activeLine + 1}/>
      }
    </Block>
  )
}

function reducer (state, action) {
  switch (action.type) {
    case changeTab.type:
      return {
        ...state,
        tab: action.payload
      }
    case setDoneLoading.type:
      return {
        ...state,
        loading: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  onCreate,
  render
}
