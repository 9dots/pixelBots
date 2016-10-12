/** @jsx element */

import element from 'vdux/element'
import {Block, Tooltip} from 'vdux-ui'
import {CSSContainer, wrap} from 'vdux-containers'

function render ({props}) {
  const {
    color = 'white',
    clickHandler,
    coordinates,
    showColor,
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
      transition={!editMode && 'background-color .75s ease-in-out'}
      bgColor={color}>
      <Tooltip relative show={showColor}>{color}</Tooltip>
    </Block>
  )
}

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})({
  render
})
