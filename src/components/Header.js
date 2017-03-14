/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'

function render ({props, children}) {
  return (
    <Block
      fixed
      h='100vh'
      w='80px'
      left='0'
      zIndex='999'
      borderRight='1px solid #e0e0e0'
      bgColor='white'
      py='10px'
      px='10px'
      column
      align='center center'
      {...props}>
      {children}
    </Block>
  )
}

export default {
  render
}
