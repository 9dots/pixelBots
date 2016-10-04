/** @jsx element */

import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import Animal from './Animal'
import {reset} from '../actions'
import reduce from '@f/reduce'

function onCreate () {
  return reset()
}

function render ({props}) {
  let {animals, numRows = 5, numColumns = 5, painted = [], active, levelSize, editMode} = props
  let rows = []

  const size = parseFloat(levelSize) / numRows + 'px'

  for (var i = 0; i < numRows; i++) {
    rows.push(
      <Row
        editMode
        size={size}
        active={active}
        row={i}
        painted={getPainted(i)}
        num={numColumns} />
    )
  }

  const animalArr = reduce(
    addToArray,
    [],
    animals
  )

  function addToArray (arr, animal, id) {
    arr.push(
      <Animal
        cellSize={size}
        active={active}
        animal={animals[id]}
        id={id}/>
    )
    return arr
  }

  return (
    <Flex wide tall relative column>
      {rows}
      {animalArr}
    </Flex>
  )

  function getPainted (idx) {
    return painted.reduce((cur, paint) => {
      if (idx === paint.loc[0]) {
        cur[paint.loc[1]] = paint.color
      }
      return cur
    }, {})
  }
}

export default {
  onCreate,
  render
}
