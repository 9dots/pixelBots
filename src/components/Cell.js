/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {
    color = 'white',
    clickHandler,
    coordinates,
    editMode,
    size
  } = props

  return (
    <Block
      border
      borderColor='#666'
      borderWidth={1}
      h={size}
      w={size}
      onClick={() => clickHandler(coordinates)}
      transition={!editMode && 'backgroundColor .75s ease-in-out'}
      bgColor={color} />
  )
}

export default {
  render
}
