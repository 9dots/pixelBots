import element from 'vdux/element'
import {Flex} from 'vdux-ui'
import Row from './Row'
import reduce from '@f/reduce'

function render ({props}) {
  let {turtles, numRows = 5, numColumns = 5, painted = []} = props
  let rows = []
  let turtleLoc = reduce((cur, turtle) => {
    cur.push(turtle.location)
    return cur
  }, [], turtles)


  for (var i = 0; i < numRows; i++) {
    rows.push(<Row painted={getPainted(i)} active={getActive(i)} num={numColumns}/>)
  }
  return (
    <Flex column>
      {rows}
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

  function getActive (idx) {
    for (var i = 0; i < turtleLoc.length; i++) {
      if (idx === turtleLoc[i][0]) {
        return turtleLoc[i][1]
      }
      return false
    }
  }
}

export default {
  render
}
