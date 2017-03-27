import createAction from '@f/create-action'
import Switch from '@f/switch'

const moveAnimal = createAction('<Game/>: MOVE_ANIMAL')
const paintSquare = createAction('<Game/>: PAINT_SQUARE')
const turnAnimal = createAction('<Game/>: TURN_ANIMAL')

export default ({dispatch, getState, actions}) => (next) => (action) => {
	Switch({
		[moveAnimal.type]: actions.animalMove,
		[paintSquare.type]: actions.animalPaint,
		[turnAnimal.type]: actions.animalTurn
	})(action.type, action.payload)
	return next(action)
}

export {
	moveAnimal,
	paintSquare,
	turnAnimal
}