import {addCode, removeLine, updateLine, aceUpdate, saveProgress} from '../actions'
import debounce from '@f/debounce'

const typesToCheck = [addCode.type, removeLine.type, updateLine.type, aceUpdate.type]

export default ({getState, dispatch}) => { 
	const debounced = debounce(() => save(getState, dispatch), 5000)
	return (next) => (action) => {
		if (typesToCheck.indexOf(action.type) > -1) {
			const result = next(action)
			debounced()
			return result
		}
		return next(action)
	}
}

function save (getState, dispatch) {
	const {saveID, gameID, game} = getState()
	const {animals} = game
	console.log(saveID)
	if (saveID) {
		dispatch(saveProgress(animals, gameID, saveID))
	}
}