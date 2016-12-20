/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import createAction from '@f/create-action'
import Output from '../components/Output'
import {initializeGame, setSaveId} from '../actions'
import {immediateSave} from '../middleware/saveCode'
import objEqual from '@f/equal-obj'
import element from 'vdux/element'
import {once} from 'vdux-fire'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

const setDoneLoading = createAction('SET_DONE_LOADING')
const changeTab = createAction('CHANGE_TAB')

function initialState ({props, local}) {
  return {
    tab: 'display',
    actions: {
      tabChanged: local((name) => changeTab(name))
    }
  }
}

function * onCreate ({props, state}) {
  yield state.actions.tabChanged('display')
  yield initializeGame(props.initialData)
}

function * onUpdate (prev, {props, state}) {
  if (!objEqual(prev.props.gameData, props.gameData)) {
    yield initializeGame(props.initialData)
    yield state.actions.tabChanged('display')
  }
}

function render ({props, state, local}) {
  const {
    selectedLine,
    activeLine,
    initialData,
    message,
    running,
    active,
    game,
    hasRun,
    saveLink,
    gameVal,
    left
  } = props

  const {
    inputType,
    animals
  } = game

  const {tab, actions} = state
  const {tabChanged} = actions
  const size = '400px'

  return (
    <Block wide tall>
      <Block
        relative
        display='flex'
        left='0'
        minHeight='100%'
        h='100%'
        wide>
        <Output
          handleTabClick={tabChanged}
          tabs={['display']}
          tab={tab}
          size={size}
          onRun={local(() => changeTab('display'))}
          hasRun={hasRun}
          {...game}
          {...props}/>
        <Controls
          selectedLine={selectedLine}
          activeLine={activeLine}
          inputType={inputType}
          running={running}
          saveID={saveLink}
          initialData={initialData}
          hasRun={hasRun}
          active={active}
          animals={animals}/>
      </Block>
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

export default ({
  initialState,
  onUpdate,
  onCreate,
  reducer,
  render
})
