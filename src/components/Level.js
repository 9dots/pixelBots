/** @jsx element */

import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import Turtle from './Turtle'
import {reset} from '../actions'

const animalTypes = {
  turtle: getTurtle
}

function getTurtle ({size, active, animal, id}) {
  return <Turtle cellSize={size} active={active} animal={animal} id={id}/>
}

function onCreate () {
  return reset()
}

function render ({props}) {
  let {animals, numRows = 5, numColumns = 5, painted = [], active, height} = props
  let rows = []
  let animalArr = []

  const size = parseInt(height) / numRows + 'px'

  for (var i = 0; i < numRows; i++) {
    rows.push(<Row size={size} height={height} active={active} row={i} painted={getPainted(i)} num={numColumns}/>)
  }

  for (var id in animals) {
    animalArr.push(animalTypes[animals[id].type]({size, active, id, animal: animals[id]}))
  }

  return (
    <Flex tall relative column>
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
