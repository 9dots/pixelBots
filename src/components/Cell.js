import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Turtle from './Turtle'
import equal from '@f/equal'

function render ({props}) {
  const {h = '50px', w = '50px', color = 'white', turtles, coordinates, active, size} = props

  return (
    <Block
      align='center center'
      border
      borderColor='black'
      borderWidth={1}
      h={size}
      w={size}
      transition='all .4s ease-in-out'
      bgColor={color} />
  )
}

export default {
  render
}
