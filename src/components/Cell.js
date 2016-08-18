/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {color = 'white', size} = props

  return (
    <Block
      align='center center'
      border
      borderColor='#666'
      borderWidth={1}
      h={size}
      w={size}
      transition='all .5s ease-in-out'
      bgColor={color} />
  )
}

export default {
  render
}
