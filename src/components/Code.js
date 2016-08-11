/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import CodeIcon from './CodeIcon'
import {removeLine} from '../actions'

function render ({props}) {
  const {turtles, active, activeLine, running} = props
  const names = {
    forward: 'arrow_upward',
    turnRight: 'rotate_right',
    turnLeft: 'rotate_left',
    paint: 'brush'
  }

  const code = turtles[active].sequence.map((line, i) => {
    const isActive = activeLine === i && running
    const icon = line.split('\(')[0]
    const color = line.match(/\'([a-z]*?)\'/gi)

    return <CodeIcon
      iconName={names[icon]}
      bgColor={isActive ? '#8fa5c9' : 'white'}
      color={icon === 'paint' ? color[0].replace(/\'/gi, '') : 'darkblue'}
      fs='40px'
      p='15px'
      cursor='pointer'
      m='2px'
      id={active}
      lineNum={i}/>
  })

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
