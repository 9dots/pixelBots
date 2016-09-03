/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Buttons from './Buttons'
import Code from './Code'

function render ({props}) {
  let {active, animals, running, activeLine, selectedLine, hasRun} = props

  return (
    <Block relative bgColor='#A7B4CB' wide tall>
      <Block tall relative align='start start'>
        <Buttons hasRun={hasRun} running={running} active={active} cursor={selectedLine || animals[active].sequence.length - 1} type={animals[active].type}/>
        <Code hasRun={hasRun} selectedLine={selectedLine} running={running} activeLine={activeLine} active={active} animals={animals}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
