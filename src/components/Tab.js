/** @jsx element */

import element from 'vdux/element'
import {MenuItem} from 'vdux-containers'

function render ({props}) {
  const {name, active, handleClick} = props
  const selected = name === active
  return (
    <MenuItem
      p='10px'
      w='120px'
      bgColor='#c5c5c5'
      textAlign='center'
      fontWeight='800'
      hoverProps={!selected && {color: '#555'}}
      onClick={() => handleClick(name)}
      highlight={selected}
      {...props}>
      {name}
    </MenuItem>
  )
}

export default {
  render
}
