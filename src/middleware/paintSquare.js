import {animalPaint, paintSquare, throwError} from '../actions'

export default function () {
  return ({getState, dispatch}) => (next) => (action) => {
    if (action.type === paintSquare.type) {
      const {id, getPaintColor} = action.payload
      const {lineNum} = action.meta
      const newColor = getPaintColor(getState(), id)
      dispatch(animalPaint(id, newColor))
    }
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
