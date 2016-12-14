import {animalMove, animalPaint, animalTurn, endRunMessage} from '../actions'
import {abortRun} from './codeRunner'
import objEqual from '@f/equal-obj'

const winMessage = {
  header: 'Congratulations',
  body: 'You have successfully painted the picture.'
}

export default ({getState, dispatch}) => (next) => (action) => {
	if (action.type === animalPaint.type) {
		const result = next(action)
		const game = getState().game
		if (game.targetPainted) {
      if (objEqual(game.targetPainted, game.painted)) {
      	dispatch(abortRun('STOP'))
      	dispatch(endRunMessage(winMessage))
      }
		}
		return result
	}
	return next(action)
}