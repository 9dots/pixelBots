/** @jsx element */

import element from 'vdux/element'
import Cell from './cell'
import {Flex} from 'vdux-ui'
import deepEqual from '@f/deep-equal'
import omit from '@f/omit'

function shouldUpdate (prev, next) {
  return !deepEqual(omit('clickHandler', prev.props), omit('clickHandler', next.props))
    || !deepEqual(prev.children, next.children)
    || prev.props.clickHandler.toString() !== next.props.clickHandler.toString()
}

function render ({props}) {
  return (
    <Flex alignItems='center center'>
      {getCells(props)}
    </Flex>
  )
}

function getCells ({size, row, painted, clickHandler, editMode, num, hideBorder}) {
  let cells = []
  for (var i = 0; i < num; i++) {
    cells.push(<Cell
      size={size}
      coordinates={[row, i]}
      hideBorder={hideBorder}
      clickHandler={clickHandler}
      color={getColor(painted, i)}
      editMode={editMode}/>)
  }
  return cells
}

function getColor (painted, idx) {
  return painted[idx] ? painted[idx] : 'white'
}

export default {
  shouldUpdate,
  render
}
