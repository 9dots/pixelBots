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
	  let {animal, ghost, active, id, cellSize, mode, animalTurn, animationSpeed, hasRun, ...restProps} = props

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
	      transition={
	      	(mode !== 'edit' && hasRun)
	      		&& `all ${animationSpeed < 0.1 ? 0.1 : animationSpeed}s ease-in-out`
	      }
	      border='1px solid rgba(0,0,0, .15)'
	      transform={`rotate(${rot}deg)`}
	      boxShadow='0 0 3px rgba(0,0,0,.3)'
	      h={animalSize}
	      w={animalSize}
	      top={`${pos.top}px`}
	      left={`${pos.left}px`}
	      bgColor='green'
	      background={`url(${thisAnimal.imageURL})`}
	      zIndex={ghost ? 998 : 999}
	      backgroundRepeat='no-repeat'
	      backgroundSize='cover'
	      opacity={ghost && 0.4}
	    	onClick={(mode === 'read' && !ghost) && [animalTurn, stopPropagation]}
	    	{...restProps} />
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
