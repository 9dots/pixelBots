import {animalMove, animalPaint, animalTurn, setModalMessage} from '../actions'
import {abortRun} from './codeRunner'
import objEqual from '@f/equal-obj'

const winMessage = {
  header: 'Congratulations',
  body: 'You have successfully painted the picture.',
  type: 'win'
}

export default ({getState, dispatch}) => (next) => (action) => {
	if (action.type === animalPaint.type) {
		const result = next(action)
		const game = getState().game
		if (game.targetPainted) {
      if (objEqual(game.targetPainted, game.painted)) {
      	setTimeout(function () {
	      	dispatch(abortRun('STOP'))
      		dispatch(setModalMessage(winMessage))
      	}, 800)
      }
		}
		return result
	}
	return next(action)
}