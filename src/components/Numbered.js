/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props, children}) {
  const {
    size = '40px',
    complete,
    error,
    number
  } = props

  return (
    <Block
      w={size}
      h={size}
      textAlign='center'
      mr='10px'
      circle
      lineHeight={size}
      bgColor={complete ? 'green' : 'white'}
      color={complete ? 'white' : '#333'}
      border={complete ? 'none' : '2px solid #333'}
      transition='all .3s ease-in-out'
      fontWeight='800'
      align='center center'
      {...props} >
      <Block>{children}</Block>
    </Block>
  )
}

export default {
  render
}
