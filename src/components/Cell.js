import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Turtle from './Turtle'

function render ({props}) {
  const {h = '50px', w = '50px', color = 'white', active} = props

  return (
    <Block align='center center' border borderColor='black' borderWidth={1} h={h} w={w} bgColor={color}>
      {active && <Turtle dir='forward'/>}
    </Block>
  )
}

export default {
  render
}
