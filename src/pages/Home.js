/** @jsx element */

import Controls from '../components/Controls'
import createAction from '@f/create-action'
import Output from '../components/Output'
import Tabs from '../components/Tabs'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import omit from '@f/omit'

const changeTab = createAction('<Home/>: CHANGE_TAB')

function initialState ({props, local}) {
  return {
    tab: 'display',
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
    speed,
    game
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
    speed,
    size
  }

  const display = (
    <Block display='flex' wide tall>
      <Output
        size={size}
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
  )

  return (
    <Block tall wide bgColor='background' relative>
      <Tabs onClick={actions.tabChanged} tabs={['display', 'options']}/>
      <Block
        relative
        left='0'
        bgColor='light'
        h='calc(100% - 40px)'
        wide>
        {tab === 'display' && display}
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
