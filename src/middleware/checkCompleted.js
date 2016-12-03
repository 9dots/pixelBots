import {animalMove, animalPaint, animalTurn, endRunMessage} from '../actions'
import {abortRun} from './codeRunner'
import objEqual from '@f/equal-obj'

const typesToCheck = [animalMove.type, animalPaint.type, animalTurn.type]
const winMessage = {
  header: 'Congratulations',
  body: 'You have successfully painted the picture.'
}

export default ({getState, dispatch}) => (next) => (action) => {
	if (typesToCheck.indexOf(action.type) > -1) {
		const game = getState().game
		if (game.targetPainted) {
      if (objEqual(game.targetPainted, game.painted)) {
      	dispatch(abortRun('STOP'))
      	dispatch(endRunMessage(winMessage))
      }
		}
	}
	return next(action)
}