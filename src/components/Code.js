/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import CodeIcon from './CodeIcon'
import {nameToIcon} from '../utils'
import {removeLine, selectLine} from '../actions'

let prevLength = 0
let lastSelected = 0

function render ({props}) {
  const {animals, active, activeLine, running, selectedLine} = props

  const code = animals[active].sequence.map((line, i, arr) => {
    const isActive = activeLine === i && running
    const name = line.split('\(')[0]
    const color = line.match(/\'([a-z]*?)\'/gi)
    const type = animals[active].type
    const addedLine = arr.length > prevLength

    return (
      <CodeIcon
        iconName={nameToIcon(name)}
        focus={selectedLine === i}
        shouldTransition={!addedLine}
        newElement={i === lastSelected && addedLine}
        name={name}
        type={type}
        bgColor={isActive ? '#B43C3C' : '#666'}
        color={name === 'paint' ? color[0].replace(/\'/gi, '') : 'white'}
        fs='40px'
        p='15px'
        h='50px'
        cursor='pointer'
        onClick={() => selectedLine === i ? selectLine(active, null) : selectLine(active, i)}
        id={active}
        lineNum={i}/>
    )
  })

  prevLength = animals[active].sequence.length
  lastSelected = typeof(selectedLine) === 'number' ? selectedLine : -10

  return (
    <Block wide tall overflowY='scroll'>
      <Block p='15px' fs='22px' fontFamily='Monaco' color='white' column>
        {code}
      </Block>
    </Block>
  )
}

export default {
  render
}
