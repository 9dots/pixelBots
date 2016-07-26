import element from 'vdux/element'
import Cell from './cell'
import {Flex} from 'vdux-ui'

function render ({props}) {
  const {num, active, painted} = props
  let cells = []

  for (var i=0; i < props.num; i++) {
    cells.push(<Cell color={checkPainted(i) > -1 ? 'red' : 'white'} active={i === active}/>)
  }

  return (
    <Flex>
      {cells}
    </Flex>
  )

  function checkPainted (idx) {
    console.log(painted.indexOf(idx))
    return painted.indexOf(idx)
  }
}

export default {
  render
}
