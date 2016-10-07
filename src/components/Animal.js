/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {setActive} from '../actions'
import * as animalApis from '../animalApis/index'

function render ({props}) {
  let {animal, active, id, cellSize, editMode, running} = props

  let api = animalApis[animal.type](id)

  if (Object.keys(animal.current).length < 1) {
    return (<div/>)
  }

  let {rot} = animal.current
  let deg = rot * 90

  let animalSize = parseFloat(cellSize) / 2 + 'px'
  let pos = getPosition()
  let seconds = api.speed / 1000

  console.log(editMode, running)

  return (
    <Block
      absolute
      onClick={() => setActive(id)}
      border={active === id}
      borderColor={'red'}
      transform={`rotate(${deg}deg)`}
      transition={!editMode && running && `all ${seconds}s ease-in-out`}
      boxShadow='0 0 1px 2px rgba(0,0,0,0.2)'
      left={pos.left}
      top={pos.top}
      h={animalSize}
      w={animalSize}
      bgColor='green'
      background={`url(${api.imageURL})`}
      backgroundSize='cover'/>
  )

  function getPosition () {
    const MULT = parseFloat(cellSize)
    const OFFSET = (MULT - parseFloat(animalSize)) / 2
    return {
      top: animal.current.location[0] * MULT + OFFSET,
      left: animal.current.location[1] * MULT + OFFSET
    }
  }
}

export default {
  render
}
