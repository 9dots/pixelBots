/**
 * Imports
 */

import animalApis, {images, gameImages} from 'animalApis'
import {stopPropagation, component, element} from 'vdux'
import {getInterval} from 'utils/animal'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'

/**
 * <Animal/>
 */

export default component({
  render ({props, state, context, children}) {
	  let {
      animal,
      active,
      id,
      cellSize,
      mode,
      animalTurn,
      userAnimal,
      animationSpeed,
      offset = 1,
      hasRun,
      speed,
      isRead,
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
	  const normalizedSpeed = isRead ? .25 : getInterval(null, speed) / 1000

	  return (
	    <Block
	    	{...restProps}
	      absolute
	      transition={
	      	animal.hidden
	      		? 0
	      		: isRead
	      			? 'all .25s ease-in-out'
	      			: (mode !== 'edit' && hasRun || type === 'teacherBot') &&
          			`all ${normalizedSpeed}s ease-in-out, opacity .5s ease-in-out`
	      }
	      transform={`rotate(${rot}deg)`}
	      h={animalSize}
	      w={animalSize}
	      top={`${pos.top}px`}
	      left={`${pos.left}px`}
	      zIndex={9999}
	      opacity={animal.hidden ? 0 : 1}>
	    		<Block
	    			// transition={`all ${normalizedSpeed}s ease-in-out`}
	    			// transform={`rotate(${rot}deg)`}
	    			pointerEvents='none'
	    			class={state.error ? 'error-shake' : ''}
	    			background={`url(${gameImages[type] || images[type]})`}
	      		backgroundRepeat='no-repeat'
	      		backgroundSize='cover'
	    			sq='100%' />
	      	{children}
	    	</Block>
	  )

	  function getPosition () {
	    const MULT = parseFloat(cellSize)
	    const OFFSET = (MULT - parseFloat(animalSize)) / 2
	    return {
	      top: (animal.current.location[0] * MULT + OFFSET) * offset,
	      left: (animal.current.location[1] * MULT + OFFSET) * offset
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
