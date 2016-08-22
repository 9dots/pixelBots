/** @jsx element */

import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'

function render ({props, children}) {
  return (
    <Block zIndex='999' boxShadow='0px 2px 4px -2px rgba(0,0,0,0.8)' bgColor='white' px='10%' align='start center' {...props}>
      <Text fontFamily='helvetica neue' fs='30px' color='#333'>{props.title}</Text>
      {children}
    </Block>
  )
}

export default {
  render
}
