/**
 * Imports
 */

import {stopPropagation, component, element} from 'vdux'
import animalApis from 'animalApis'
import {Block} from 'vdux-ui'

/**
 * <Animal/>
 */

export default component({
  render ({props}) {
	  let {animal, active, id, cellSize, mode, animalTurn, animationSpeed, hasRun, ...rest} = props

	  if (Object.keys(animal.current).length < 1) {
	    return <div/>
	  }

	  const {rot} = animal.current
	  const thisAnimal = animalApis[animal.type]
	  const animalSize = Math.floor(parseFloat(cellSize) / 1.5) + 'px'
	  const pos = getPosition()

	  return (
	    <Block
	      absolute
	      border='1px solid rgba(0,0,0, .15)'
	      transform={`rotate(${rot}deg)`}
	      transition={(mode !== 'edit' && hasRun) && `all ${animationSpeed}s ease-in-out`}
	      boxShadow='0 0 3px rgba(0,0,0,.3)'
	      h={animalSize}
	      w={animalSize}
	      top={`${pos.top}px`}
	      left={`${pos.left}px`}
	      bgColor='green'
	      background={`url(${thisAnimal.imageURL})`}
	      zIndex={999}
	      backgroundSize='cover'
	      backgroundRepeat='no-repeat'
	      {...rest} />
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
})
