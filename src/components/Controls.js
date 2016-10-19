/** @jsx element */

import createAction from '@f/create-action'
import Documentation from './Documentation'
import {Block, Box} from 'vdux-containers'
import element from 'vdux/element'
import Buttons from './Buttons'
import CodeBox from './CodeBox'
import Runner from './Runner'
import Code from './Code'
import Tab from './Tab'

const changeTab = createAction('CHANGE_TAB: controls')

function initialState () {
  return {
    tab: 'code'
  }
}

function render ({props, state, local}) {
  const {
    active,
    animals,
    running,
    selectedLine,
    hasRun,
    inputType,
    onRun
  } = props
  const sequence = animals[active].sequence || []
  const {tab} = state

  return (
    <Block
      minHeight='600px'
      boxShadow='0 0 2px 1px rgba(0,0,0,0.2)'
      wide
      bgColor='light'
      color='white'
      my='20px'
      mx='20px'>
      <Block bgColor='secondary' wide align='flex-end center'>
        <Block h='80%'>
          <Runner
            onRun={onRun}
            relative
            tall
            ml='10px'
            running={running}
            hasRun={hasRun} />
        </Block>
        <Box flex align='flex-end center'>
          <Tab
            bgColor='secondary'
            onClick={local(() => changeTab('documentation'))}
            color='white'
            name='documentation'
            active={tab === 'documentation'}
            fs='s'/>
          <Tab
            bgColor='secondary'
            onClick={local(() => changeTab('code'))}
            color='white'
            active={tab === 'code'}
            name='code'
            fs='s'/>
        </Box>
      </Block>
      <Block h='calc(100% - 40px)' wide relative align='start start'>
        <Buttons
          onRun={onRun}
          hasRun={hasRun}
          running={running}
          changeTab={local(() => changeTab('documentation'))}
          active={active}
          inputType={inputType}
          cursor={selectedLine || sequence.length - 1} type={animals[active].type}/>
        {tab === 'code'
          ? inputType === 'icons' ? <Code {...props}/> : <CodeBox {...props} />
          : <Documentation animal={animals[active]}/>
        }
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
