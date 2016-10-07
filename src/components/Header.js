/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'

function render ({props, children}) {
  return (
    <Block
      fixed
      h='100vh'
      w='66px'
      left='0'
      overflow='hidden'
      zIndex='999'
      boxShadow='0px 2px 4px -2px rgba(0,0,0,0.8)'
      bgColor='white'
      py='10px'
      px='10px'
      transition='width .2s ease-in-out'
      lingerProps={{w: '250px'}}
      {...props}>
      {children}
    </Block>
  )
}

export default {
  render
}
