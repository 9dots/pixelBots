/** @jsx element */

import element from 'vdux/element'
import {MenuItem} from 'vdux-containers'

function render ({props, children}) {
  const {name, active, handleClick} = props
  return (
    <MenuItem
      p='10px'
      w='200px'
      bgColor='#c5c5c5'
      textAlign='center'
      textTransform='uppercase'
      fontWeight='800'
      hoverProps={!active && {color: '#e5e5e5'}}
      onClick={() => handleClick(name)}
      highlight={active}
      {...props}>
      {name}
      {children}
    </MenuItem>
  )
}

export default {
  render
}
