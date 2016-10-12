/** @jsx element */

import element from 'vdux/element'
import {Block, Box} from 'vdux-ui'
import CodeIcon from './CodeIcon'
import {nameToIcon} from '../utils'
import {selectLine} from '../actions'
import Outline from './Outline'
import Cursor from './Cursor'

let prevLength = 0
let lastSelected = 0

function render ({props, local, state}) {
  const {animals, active, activeLine, selectedLine, hasRun} = props
  const lineHeight = '36px'
  const sequence = animals[active].sequence || []

  const code = sequence.map((line, i, arr) => {
    const isActive = activeLine === i && hasRun
    const name = line.split('\(')[0]
    const re = /\((.*?)(?:\))/gi
    const argMatch = re.exec(line)
    const argument = argMatch ? argMatch[1] : ''
    const type = animals[active].type
    const addedLine = arr.length > prevLength

    return (
      <Block id={`code-icon-${i}`} cursor='pointer' onClick={() => selectLine(active, i)}>
        <Cursor h='14px' active={selectedLine === i}/>
        <CodeIcon
          iconName={nameToIcon(name)}
          focus={selectedLine === i}
          shouldTransition={!addedLine}
          newElement={i === lastSelected && addedLine}
          numLines={arr.length}
          name={name}
          type={type}
          bgColor={isActive ? '#B43C3C' : '#666'}
          argument={argument}
          fs='28px'
          p='15px'
          w='250px'
          h={lineHeight}
          animal={active}
          lineNum={i}/>
      </Block>
    )
  })

  prevLength = sequence.length
  lastSelected = typeof (selectedLine) === 'number' ? selectedLine : -10

  return (
    <Box
      flex
      class='code-editor'
      bgColor='#A7B4CB'
      minWidth='480px'
      relative
      tall
      overflowY='auto'>
      <Block absolute w='50px' left='0' tall/>
      <Block p='4px 15px' pl='66px' fs='22px' fontFamily='Monaco' color='white' column wide>
        {code}
        <Block w='250px' cursor='pointer' onClick={() => selectLine(active, prevLength)}>
          <Cursor h='18px' active={selectedLine === prevLength}/>
          <Outline color='black' width='2px' style='dashed' wide h={lineHeight}/>
        </Block>
      </Block>
    </Box>
  )
}

export default {
  render
}
