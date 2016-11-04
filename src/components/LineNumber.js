/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {lineNum, numLines} = props
  const digits = numLines.toString().length
  const offset = digits * 6

  return (
    <Block mt='5px' color='#333' {...props} w='30px' left={`${offset}px`}>
      {lineNum}
    </Block>
  )
}

export default {
  render
}
