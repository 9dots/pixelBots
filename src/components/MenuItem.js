
/** @jsx element */

import {Block, Text} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import element from 'vdux/element'

function render ({props, children}) {
  const {label = 'test', value, onClick, ...restProps} = props
  return (
    <MenuItem
      borderBottom='1px solid #e0e0e0'
      align='start center'
      hoverProps={{bgColor: 'rgba(33, 150, 243, 0.2)'}}
      fs='m'
      fontWeight='300'
      onClick={onClick}
      p='24px'
      wide
      {...restProps}>
      <Block w='25%'>
        <Text display='block'>{label}</Text>
      </Block>
      <Block flex>
        {value}
      </Block>
      {children}
    </MenuItem>
  )
}

export default {
  render
}
