/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Buttons from './Buttons'
import Runner from './Runner'
import Code from './Code'

function render ({props}) {
  let {active, turtles, running, activeLine} = props

  return (
    <Block relative bgColor='#7689A9' wide tall>
      <Runner running={running} h='10%'/>
      <Block h='90%' relative align='start start'>
        <Buttons active={active}/>
        <Code running={running} activeLine={activeLine} active={active} turtles={turtles}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
