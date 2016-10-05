/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {color = 'white', size, clickHandler} = props

  return (
    <Block
      border
      borderColor='#666'
      borderWidth={1}
      h={size}
      w={size}
      transition='all .75s ease-in-out'
      onClick={clickHandler}
      bgColor={color} />
  )
}

export default {
  render
}
