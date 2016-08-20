/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {width, color, style} = props
  return (
    <Block borderWidth={width} borderColor={color} borderStyle={style} {...props}/>
  )
}

export default {
  render
}
