import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import Turtle from './Turtle'
import reduce from '@f/reduce'

function render ({props}) {
  let {turtles, numRows = 5, numColumns = 5, painted = [], active, height} = props
  let rows = []
  let turtleArr = []
  const size = parseInt(height) / numRows + 'px'

  for (var i = 0; i < numRows; i++) {
    rows.push(<Row size={size} height={height} active={active} turtles={turtles} row={i} painted={getPainted(i)} num={numColumns}/>)
  }

  for (var turtle in turtles) {
    turtleArr.push(<Turtle cellSize={size} active={active} turtle={turtles[turtle]} id={turtle}/>)
  }

  return (
    <Flex tall relative column>
      {rows}
      {turtleArr}
    </Flex>
  )

  function getPainted (idx) {
    return painted.reduce((cur, loc) => {
      if (idx === loc[0]) {
        cur.push(loc[1])
      }
      return cur
    }, [])
  }
}

export default {
  render
}
