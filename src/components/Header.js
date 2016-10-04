/** @jsx element */

import element from 'vdux/element'
import {Block, Box, Text} from 'vdux-ui'

function render ({props, children}) {
  return (
    <Block zIndex='999' boxShadow='0px 2px 4px -2px rgba(0,0,0,0.8)' bgColor='white' px='10%' align='start center' {...props}>
      <Box style={{flex: 1}}>
        <Text fontFamily='helvetica neue' fs='30px' color='#333'>{props.title}</Text>
      </Box>
      <Block>
        {children}
      </Block>
    </Block>
  )
}

export default {
  render
}
