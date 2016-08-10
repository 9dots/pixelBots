import element from 'vdux/element'
import Cell from './cell'
import {Flex} from 'vdux-ui'

function render ({props}) {
  const {painted, row, size} = props
  let cells = []

  for (var i = 0; i < props.num; i++) {
    cells.push(<Cell size={size} coordinates={[row, i]} color={getColor(i)}/>)
  }

  return (
    <Flex>
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
