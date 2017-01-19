import {addCode, removeLine, updateLine, aceUpdate, setSaved, saveProgress} from '../actions'
import debounce from '@f/debounce'
import createAction from '@f/create-action'

const immediateSave = createAction('saveCode.js: IMMEDIATE_SAVE')
const typesToCheck = [addCode.type, removeLine.type, updateLine.type, aceUpdate.type]
let cancel

export default ({getState, dispatch}) => {
  const debounced = debounce(() => save(getState, dispatch), 5000)
  return (next) => (action) => {
    if (typesToCheck.indexOf(action.type) > -1) {
      const result = next(action)
      dispatch(setSaved(false))
      cancel = debounced()
      return result
    }
    if (action.type === immediateSave.type) {
      if (cancel) { cancel() }
      save(getState, dispatch)
      return next(action)
    }
    return next(action)
  }
}

function save (getState, dispatch) {
  const {saveID, gameID, game} = getState()
  const {animals} = game

  if (saveID) {
    dispatch(saveProgress(animals, gameID, saveID))
  }
  cancel = null
}

export {
	immediateSave
}
