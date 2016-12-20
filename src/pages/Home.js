/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import Controls from '../components/Controls'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Output from '../components/Output'
import omit from '@f/omit'
import createAction from '@f/create-action'

const changeTab = createAction('<Home/>: CHANGE_TAB')

function initialState ({props, local}) {
  return {
    tab: 'sandbox',
    actions: {
      tabChanged: local((name) => changeTab(name))
    }
  }
}

function render ({props, state}) {
  const {
    selectedLine,
    activeLine,
    running,
    active,
    hasRun,
    game,
    left
  } = props

  const {actions, tab} = state

  const {
    animals,
    inputType
  } = game

  const size = '400px'

  const outputProps = {
    inputType,
    animals: animals.map((animal) => omit('sequence', animal)),
    running,
    active,
    size
  }

  return (
    <Block tall wide bgColor='background' relative>
      <Block
      relative
        relative
        display='flex'
        left='0'
        minHeight='100%'
        h='100%'
        wide>
        <Output
          size={size}
          tabs={['sandbox', 'options']}
          handleTabClick={actions.tabChanged}
          tab={tab}
          options
          hasRun={hasRun}
          {...game}
          {...outputProps}
        />
        <Controls
          selectedLine={selectedLine}
          activeLine={activeLine}
          inputType={inputType}
          running={running}
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
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}
