import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {setActive} from '../actions'

function render ({props}) {
  let {turtle, active, id, cellSize} = props

  if (Object.keys(turtle.current).length < 1) {
    return (<div/>)
  }

  let {rot} = turtle.current
  let deg = rot * 90

  let turtleSize = parseInt(cellSize) / 2 + 'px'
  let pos = getPosition()

  return (
    <Block
      absolute
      onClick={() => setActive(id)}
      border={active === id}
      borderColor={'red'}
      transform={`rotate(${deg}deg)`}
      transition='all .4s ease-in-out'
      boxShadow='0 0 1px 2px rgba(0,0,0,0.2)'
      left={pos.left}
      top={pos.top}
      h={turtleSize}
      w={turtleSize}
      bgColor='green' >
      <Block absolute h='10%' w='10%' top='10%' right='20%' bgColor='black'/>
      <Block absolute h='10%' w='10%' top='10%' left='20%' bgColor='black'/>
    </Block>
  )

  function getPosition () {
    const MULT = parseInt(cellSize)
    const OFFSET = (MULT - parseInt(turtleSize)) / 2
    return {
      top: turtle.current.location[0] * MULT + OFFSET,
      left: turtle.current.location[1] * MULT + OFFSET
    }
  }
}

export default {
  render
}
