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

function initialState ({props}) {
  return {
    tab: 'target'
  }
}

function * onCreate ({props}) {
  const {gameID} = props
  const playSnapshot = yield once({ref: `/play/${gameID}`})
  const gameCode = playSnapshot.val()
  const gameSnapshot = yield once({ref: `/games/${gameCode}`})
  return yield initializeGame(gameSnapshot.val())
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

  const {
    inputType,
    animals
  } = game

  const {tab} = state

  const size = '550px'

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
          handleTabClick={local((name) => changeTab(name))}
          tabs={['actual', 'target']}
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
  }
  return state
}

export default {
  initialState,
  reducer,
  onCreate,
  render
}
