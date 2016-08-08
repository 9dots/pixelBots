import element from 'vdux/element'
import {Block, Button} from 'vdux-ui'

import {
  addCode
} from '../actions'

function render ({props}) {
  const {active} = props

  return (
    <Block w= '100px' bgColor='#4D658D' column align='start center' p='10px' tall>
      <Button m='5px' p='15px' fs='24px' bgColor='primary' icon='arrow_upward' onClick={() => addCode(active, 'forward()')}/>
      <Button m='5px' p='15px' fs='24px' bgColor='primary' icon='rotate_right' onClick={() => addCode(active, 'turnRight()')}>Turn Right</Button>
      <Button m='5px' p='15px' fs='24px' bgColor='primary' icon='rotate_left' onClick={() => addCode(active, 'turnLeft()')}>Turn Left</Button>
      <Button m='5px' p='15px' fs='24px' bgColor='primary' icon='brush' onClick={() => addCode(active, 'paint()')}>Turtle Paint</Button>
    </Block>
  )
}

export default {
  render
}
