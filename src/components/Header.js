/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'

function render ({props, children}) {
  return (
    <Block
      fixed
      h='100vh'
      w='100px'
      left='0'
      overflow='hidden'
      zIndex='999'
      boxShadow='0px 2px 4px -2px rgba(0,0,0,0.8)'
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
