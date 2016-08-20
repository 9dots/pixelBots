/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import CodeIcon from './CodeIcon'
import {nameToIcon} from '../utils'
import {selectLine} from '../actions'
import Outline from './Outline'
import Cursor from './Cursor'

let prevLength = 0
let lastSelected = 0

function render ({props, local, state}) {
  const {animals, active, activeLine, running, selectedLine} = props
  const lineHeight = '50px'

  const code = animals[active].sequence.map((line, i, arr) => {
    const isActive = activeLine === i && running
    const name = line.split('\(')[0]
    const color = line.match(/\'([a-z]*?)\'/gi)
    const type = animals[active].type
    const addedLine = arr.length > prevLength

    return (
      <Block id={`code-icon-${i}`} cursor='pointer' onClick={() => selectLine(active, i)}>
        <Cursor h='18px' active={selectedLine === i}/>
        <CodeIcon
          iconName={nameToIcon(name)}
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
          animal={active}
          lineNum={i}/>
      </Block>
    )
  })

  prevLength = animals[active].sequence.length
  lastSelected = typeof (selectedLine) === 'number' ? selectedLine : -10

  return (
    <Block class='code-editor' relative wide tall overflowY='scroll'>
      <Block absolute w='50px' left='0' tall/>
      <Block p='4px 15px' ml='50px' fs='22px' fontFamily='Monaco' color='white' column>
        {code}
        <Block cursor='pointer' onClick={() => selectLine(active, prevLength)}>
          <Cursor h='18px' active={selectedLine === prevLength}/>
          <Outline color='black' width='2px' style='dashed' wide h={lineHeight}/>
        </Block>
      </Block>
    </Block>
  )
}

export default {
  render
}
