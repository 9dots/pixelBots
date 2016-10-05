/** @jsx element */

import element from 'vdux/element'
import Cell from './cell'
import {Flex} from 'vdux-ui'

function render ({props}) {
  const {painted, row, size, editMode, clickHandler} = props
  let cells = []

  for (var i = 0; i < props.num; i++) {
    cells.push(<Cell size={size} coordinates={[row, i]} color={getColor(i)} editMode={editMode} clickHandler={clickHandler}/>)
  }

  return (
    <Flex alignItems='center center'>
      {cells}
    </Flex>
  )

  function getColor (idx) {
    return painted[idx] ? painted[idx] : 'white'
  }
}

export default {
  render
}
