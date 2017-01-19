/** @jsx element */

import element from 'vdux/element'
import Cell from './Cell'
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

function getCells ({row, painted, color, numColumns, ...restProps}) {
  let cells = []
  for (var i = 0; i < numColumns; i++) {
    cells.push(<Cell
      coordinates={[row, i]}
      paintColor={color}
      color={getColor(painted, i)}
      {...restProps}/>)
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
