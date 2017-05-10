/**
 * Imports
 */

import {stopPropagation, component, element} from 'vdux'
import animalApis from 'animalApis'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'

/**
 * <Animal/>
 */

export default component({
  render ({props, state}) {
	  let {animal, ghost, active, id, cellSize, mode, animalTurn, animationSpeed, hasRun, ...restProps} = props
	  if (Object.keys(animal.current).length < 1) {
	    return <div/>
	  }

	  const {rot} = animal.current
	  const thisAnimal = animalApis[animal.type]
	  const animalSize = Math.floor(parseFloat(cellSize) / 1.1) + 'px'
	  const pos = getPosition()

	  return (
	    <Block
	      absolute
	      transition={
	      	(mode !== 'edit' && hasRun)
	      		&& `all ${animationSpeed < 0.1 ? 0.1 : animationSpeed}s ease-in-out`
	      }
	      transform={`rotate(${rot}deg)`}
	      h={animalSize}
	      w={animalSize}
	      top={`${pos.top}px`}
	      left={`${pos.left}px`}
	      zIndex={ghost ? 998 : 999}
	      opacity={ghost && 0.4}
	      pointerEvents={mode === 'edit' ? 'none' : 'default'}
	    	onClick={(mode === 'read' && !ghost) && [animalTurn, stopPropagation]}
	    	{...restProps}>
	    		<Block
	    			class={state.error ? 'error-shake' : ''}
	    			background={`url(${thisAnimal.gameImage || thisAnimal.imageURL})`}
	      		backgroundRepeat='no-repeat'
	      		backgroundSize='cover'
	    			sq='100%' />
	    	</Block>
	  )

	  function getPosition () {
	    const MULT = parseFloat(cellSize)
	    const OFFSET = (MULT - parseFloat(animalSize)) / 2
	    return {
	      top: animal.current.location[0] * MULT + OFFSET,
	      left: animal.current.location[1] * MULT + OFFSET
	    }
	  }
  },

  * onUpdate (prev, next) {
  	if (prev.props.invalid !== next.props.invalid && next.props.invalid && !next.state.error) {
  		yield next.actions.setError(true)
  		yield sleep(150)
  		yield next.actions.setError(false)
  	}
  },

  reducer: {
  	setError: (state, error) => ({error})
  }
})
