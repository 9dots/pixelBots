/** @jsx element */

import {MenuItem, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props, children}) {
  const {label, ...restProps} = props
  return (
    <MenuItem
      wide
      borderBottom='1px solid #ccc'
      fs='m'
      align='start center'
      fontWeight='300'
      p='24px'
      hoverProps={{highlight: true}}
      {...restProps}>
      <Text display='block' w='25%'>{label}</Text>
      {children}
    </MenuItem>
  )
}

export default {
  render
}
