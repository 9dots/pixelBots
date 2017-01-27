/** @jsx element */

import element from 'vdux/element'
import {Block, Tooltip} from 'vdux-ui'
import {CSSContainer, wrap} from 'vdux-containers'
import deepEqual from '@f/deep-equal'
import omit from '@f/omit'

function shouldUpdate (prev, next) {
  return !deepEqual(omit(['clickHandler', 'handleMouseOver'], prev.props), omit(['clickHandler', 'handleMouseOver'], next.props)) ||
    !deepEqual(prev.children, next.children) ||
    prev.props.clickHandler.toString() !== next.props.clickHandler.toString()
}

function render ({props}) {
  const {
    color = 'white',
    animationSpeed,
    clickHandler,
    coordinates,
    hideBorder,
    showColor,
    editMode,
    dragging,
    size
  } = props
  return (
    <Block
      transition={!editMode && `background-color ${animationSpeed}s ease-in-out`}
      onMouseOver={handleMouseOver}
      onMouseDown={() => clickHandler(coordinates)}
      borderWidth={hideBorder ? 0 : 0.5}
      borderColor='#999'
      bgColor={color}
      h={size}
      w={size}
      border>
      <Tooltip relative show={showColor}>{color}</Tooltip>
    </Block>
  )

  function * handleMouseOver (e) {
    if (dragging) {
      yield clickHandler(coordinates)
    }
  }
}

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})({
  render,
  shouldUpdate
})
