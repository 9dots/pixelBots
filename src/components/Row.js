import element from 'vdux/element'
import Cell from './cell'
import {Flex} from 'vdux-ui'

function render ({props}) {
  const {num, active, painted, row, turtles, size} = props
  let cells = []

  for (var i=0; i < props.num; i++) {
    cells.push(<Cell size={size} coordinates={[row, i]} color={checkPainted(i) > -1 ? 'lightblue' : 'white'}/>)
  }

  return (
    <Flex>
      {cells}
    </Flex>
  )

  function checkPainted (idx) {
    return painted.indexOf(idx)
  }
}

export default {
  render
}
