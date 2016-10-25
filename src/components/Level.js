/** @jsx element */

import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import Animal from './Animal'
import reduce from '@f/reduce'

function render ({props}) {
  let {
    animals,
    numRows = 5,
    numColumns = 5,
    painted = [],
    active,
    running,
    levelSize,
    clickHandler = () => {},
    editMode,
    w = '100%',
    h = '100%'
  } = props

  const size = parseFloat(levelSize) / numRows + 'px'

  return (
    <Flex w={w} h={h} relative column>
      {getRows({...props, size})}
      {animals.map((animal, i) => (
        <Animal
          running={running}
          editMode={editMode}
          cellSize={size}
          active={active}
          animal={animal}
          id={i}/>
      ))}
    </Flex>
  )
}

function getRows ({editMode, clickHandler, size, active, numColumns, numRows, painted}) {
  let rows = []
  for (var i = 0; i < numRows; i++) {
    rows.push(
      <Row
        editMode={editMode}
        clickHandler={clickHandler}
        size={size}
        active={active}
        row={i}
        painted={getPainted(i, painted)}
        num={numColumns} />
    )
  }
  return rows
}

function getPainted (idx, painted) {
  return reduce((cur, next, key) => {
    const loc = key.split(',').map((num) => Number(num))
    if (idx === loc[0]) {
      cur[loc[1]] = next
    }
    return cur
  }, {}, painted)
}


export default {
  render
}
