import element from 'vdux/element'
import {Block, Button} from 'vdux-containers'
import PaintButton from './paintButton'

import {
  addCode
} from '../actions'

function render ({props}) {
  const {active} = props

  return (
    <Block w='100px' bgColor='#4D658D' column align='start center' p='10px' tall>
      <Button m='5px' p='15px' fs='40px' bgColor='primary' icon='arrow_upward' onClick={() => addCode(active, 'forward()')}/>
      <Button m='5px' p='15px' fs='40px' bgColor='primary' icon='rotate_right' onClick={() => addCode(active, 'turnRight()')}>Turn Right</Button>
      <Button m='5px' p='15px' fs='40px' bgColor='primary' icon='rotate_left' onClick={() => addCode(active, 'turnLeft()')}>Turn Left</Button>
      <PaintButton clickHandler={(color) => addCode(active, `paint('${color}')`)}/>
    </Block>
  )
}

export default {
  render
}
