/** @jsx element */

import element from 'vdux/element'
import {Block, Tooltip} from 'vdux-ui'
import {CSSContainer, wrap} from 'vdux-containers'
import deepEqual from '@f/deep-equal'
import omit from '@f/omit'

function shouldUpdate (prev, next) {
  return !deepEqual(omit('clickHandler', prev.props), omit('clickHandler',next.props))
    || !deepEqual(prev.children, next.children)
    || prev.props.clickHandler.toString() !== next.props.clickHandler.toString()
}

function render ({props}) {
  const {
    color = 'white',
    clickHandler = () => {},
    coordinates,
    showColor,
    editMode,
    size,
    actions
  } = props

  return (
    <Block
      border
      borderColor='#999'
      borderWidth={1}
      h={size}
      w={size}
      onClick={() => clickHandler(coordinates)}
      transition={!editMode && 'background-color .2s ease-in-out'}
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
  render,
  shouldUpdate
})
