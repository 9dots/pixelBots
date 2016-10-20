/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

const colors = {
  none: {
    bgColor: 'white',
    color: '#333'
  },
  complete: {
    bgColor: 'green',
    color: 'white'
  },
  error: {
    bgColor: 'red',
    color: 'white'
  }
}

function getCurrent (c, e) {
  if (e) {
    return colors['error']
  } else if (c) {
    return colors['complete']
  } else {
    return colors['none']
  }
}

function render ({props, children}) {
  const {
    size = '40px',
    complete,
    error,
    number
  } = props

  const current = getCurrent(complete, error)

  return (
    <Block
      w={size}
      h={size}
      textAlign='center'
      mr='10px'
      circle
      lineHeight={size}
      bgColor={current.bgColor}
      color={current.color}
      border={complete || error ? 'none' : '2px solid #333'}
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
