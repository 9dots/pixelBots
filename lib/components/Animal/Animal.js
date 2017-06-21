/**
 * Imports
 */

import animalApis, {images, gameImages} from 'animalApis'
import {stopPropagation, component, element} from 'vdux'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'

/**
 * <Animal/>
 */

export default component({
  render ({props, state, context}) {
	  let {
      animal,
      active,
      id,
      cellSize,
      mode,
      animalTurn,
      userAnimal,
      animationSpeed,
      hasRun,
      ...restProps
    } = props

	  if (Object.keys(animal.current).length < 1) {
	    return <div/>
	  }

    const type = animal.type === 'teacherBot' ? animal.type : userAnimal || 'penguin'

	  const {rot} = animal.current
	  const thisAnimal = animalApis[type]
	  const animalSize = Math.floor(parseFloat(cellSize) / 1.1) + 'px'
	  const pos = getPosition()

	  return (
	    <Block
	      absolute
	      
	      transform={`rotate(${rot}deg)`}
	      h={animalSize}
	      w={animalSize}
	      top={`${pos.top}px`}
	      left={`${pos.left}px`}
	      zIndex={999}
	      opacity={animal.hidden ? 0 : 1}
	      pointerEvents='none'
	    	{...restProps}>
	    		<Block
	    			class={state.error ? 'error-shake' : ''}
	    			background={`url(${gameImages[type] || images[type]})`}
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
