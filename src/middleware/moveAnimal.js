import {animalMove, moveAnimal, throwError} from '../actions'

export default function () {
  return ({getState, dispatch}) => next => action => {
    if (action.type === moveAnimal.type) {
      const {levelSize, animals} = getState()
      const {id, getLocation} = action.payload
      const {lineNum} = action.meta
      const newLocation = getLocation(animals[id].current.location)
      checkBounds(newLocation, levelSize)
        ? dispatch(animalMove(id, newLocation, lineNum))
        : dispatch(throwError('Out of bounds', lineNum))
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
