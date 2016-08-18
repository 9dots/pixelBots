/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {lineNum, numLines} = props
  const digits = numLines.toString().length
  const offset = digits * 12

  return (
    <Block color='#333' {...props} w='30px' left={`-${79 - offset}px`}>
      {lineNum}
    </Block>
  )
}

export default {
  render
}
