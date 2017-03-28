import createAction from '@f/create-action'
import Switch from '@f/switch'

const moveAnimal = createAction('<botsMiddleware/>: MOVE_ANIMAL')
const paintSquare = createAction('<botsMiddleware/>: PAINT_SQUARE')
const turnAnimal = createAction('<botsMiddleware/>: TURN_ANIMAL')

export default ({dispatch, getState, actions}) => (next) => (action) => {
	return Switch({
		[moveAnimal.type]: handleAnimalMove,
		[paintSquare.type]: handlePaintSquare,
		[turnAnimal.type]: handleAnimalTurn,
		default: () => next(action)
	})(action.type, action.payload)

	function handlePaintSquare ({id, color}) {
		const {animals} = getState()
		const location = animals[id].current.location      
		dispatch(actions.animalPaint({id, color, location}))
		return next(action)
	}

	function handleAnimalTurn ({id, turn}) {
    const {animals} = getState()
    const rot = animals[id].current.rot + turn
    dispatch(actions.animalTurn({id, rot}))
    return next(action)
	}

	function handleAnimalMove ({id, getLocation, lineNum}) {
		const {levelSize, animals} = getState()
    const newLocation = getLocation(animals[id].current.location, animals[id].current.rot)
    checkBounds(newLocation, levelSize)
      ? dispatch(actions.animalMove({id, location: newLocation}))
      : dispatch(actions.throwError({message: 'Out of bounds', lineNum: lineNum - 1}))
    return next(action)
	}
}

function checkBounds (location, level) {
  for (var coord in location) {
    if (location[coord] >= level[coord] || location[coord] < 0) {
      return false
    }
  }
  return true
}

export {
	moveAnimal,
	paintSquare,
	turnAnimal
}
