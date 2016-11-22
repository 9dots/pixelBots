/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import createAction from '@f/create-action'
import Output from '../components/Output'
import {initializeGame, setSaveId} from '../actions'
import element from 'vdux/element'
import {once} from 'vdux-fire'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

const setDoneLoading = createAction('SET_DONE_LOADING')
const changeTab = createAction('CHANGE_TAB')

function initialState ({props, local}) {
  return {
    tab: 'target',
    actions: {
      tabChanged: local((name) => changeTab(name))
    }
  }
}

function * onCreate ({props}) {
  yield initializeGame(props.initialData)
}

function render ({props, state, local}) {
  const {
    savedProgress,
    selectedLine,
    activeLine,
    message,
    running,
    active,
    game,
    hasRun,
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

function * updatedSavedAnimal () {

}

export default ({
  initialState,
  onCreate,
  reducer,
  render
})
