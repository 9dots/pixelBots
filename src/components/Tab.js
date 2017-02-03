/** @jsx element */

import element from 'vdux/element'
import {MenuItem, Text} from 'vdux-containers'

function render ({props, children}) {
  const {name, active, handleClick} = props
  return (
    <MenuItem
      px='1.5em'
      align='center center'
      bgColor='#c5c5c5'
      textAlign='center'
      textTransform='uppercase'
      fontWeight='800'
      hoverProps={!active && {color: '#e5e5e5'}}
      onClick={() => handleClick(name)}
      highlight={active}
      {...props}>
      <Text display='block'>{name}</Text>
      {children}
    </MenuItem>
  )
}

export default {
  render
}
