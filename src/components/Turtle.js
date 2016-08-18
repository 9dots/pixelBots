/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {setActive} from '../actions'

function render ({props}) {
  let {animal, active, id, cellSize} = props

  if (Object.keys(animal.current).length < 1) {
    return (<div/>)
  }

  let {rot} = animal.current
  let deg = rot * 90

  let animalSize = parseInt(cellSize) / 2 + 'px'
  let pos = getPosition()

  return (
    <Block
      absolute
      onClick={() => setActive(id)}
      border={active === id}
      borderColor={'red'}
      transform={`rotate(${deg}deg)`}
      transition='all .5s ease-in-out'
      boxShadow='0 0 1px 2px rgba(0,0,0,0.2)'
      left={pos.left}
      top={pos.top}
      h={animalSize}
      w={animalSize}
      bgColor='green' >
      <Block absolute h='10%' w='10%' top='10%' right='20%' bgColor='black'/>
      <Block absolute h='10%' w='10%' top='10%' left='20%' bgColor='black'/>
    </Block>
  )

  function getPosition () {
    const MULT = parseInt(cellSize)
    const OFFSET = (MULT - parseInt(animalSize)) / 2
    return {
      top: animal.current.location[0] * MULT + OFFSET,
      left: animal.current.location[1] * MULT + OFFSET
    }
  }
}

export default {
  render
}
