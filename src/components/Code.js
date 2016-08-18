/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import CodeIcon from './CodeIcon'
import {nameToIcon} from '../utils'
import {selectLine} from '../actions'
import Outline from './Outline'
import createAction from '@f/create-action'
import {scrollTo} from '../middleware/scroll'

const showOutline = createAction('SHOW_OUTLINE')
const hideOutline = createAction('HIDE_OUTLINE')

let prevLength = 0
let lastSelected = 0

function initialState () {
  return {
    outline: false
  }
}

function render ({props, local, state}) {
  const {animals, active, activeLine, running, selectedLine} = props
  let {outline} = state
  const lineHeight = '50px'

  const code = animals[active].sequence.map((line, i, arr) => {
    const isActive = activeLine === i && running
    const name = line.split('\(')[0]
    const color = line.match(/\'([a-z]*?)\'/gi)
    const type = animals[active].type
    const addedLine = arr.length > prevLength

    return (
      <CodeIcon
        iconName={nameToIcon(name)}
        id={`code-icon-${i}`}
        focus={selectedLine === i}
        shouldTransition={!addedLine}
        newElement={i === lastSelected && addedLine}
        numLines={arr.length}
        name={name}
        type={type}
        bgColor={isActive ? '#B43C3C' : '#666'}
        color={name === 'paint' ? color[0].replace(/\'/gi, '') : 'white'}
        fs='40px'
        p='15px'
        h={lineHeight}
        cursor='pointer'
        removeOutline={local(() => hideOutline())}
        onClick={[local(() => setOutline(i)), () => getSelectedLine(i)]}
        animal={active}
        lineNum={i}/>
    )
  })

  prevLength = animals[active].sequence.length
  lastSelected = typeof (selectedLine) === 'number' ? selectedLine : -10

  return (
    <Block class='code-editor' relative wide tall overflowY='scroll'>
      <Block absolute w='50px' left='0' tall/>
      <Block p='4px 15px' ml='50px' fs='22px' fontFamily='Monaco' color='white' column>
        {code}
        {<Outline
          absolute
          class='code-outline'
          opacity={outline ? 1 : 0}
          onClick={[local(() => hideOutline()), () => selectLine(active, null)]}
          h={lineHeight}
          w='calc(100% - 80px)'
          transition={outline ? 'opacity 1s ease-in-out' : 'top .3s ease-in-out'}
          top={`${(parseInt(lineHeight) + 4) * lastSelected + 8}px`}
          border='2px dashed black'/>}
      </Block>
    </Block>
  )

  function setOutline (idx) {
    return selectedLine === idx ? hideOutline : showOutline
  }

  function getSelectedLine (idx) {
    return selectedLine === idx ? selectLine(active, null) : selectLine(active, idx)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case showOutline.type:
      return {
        ...state,
        outline: true
      }
    case hideOutline.type:
      return {
        ...state,
        outline: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}
