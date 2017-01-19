import {animalMove, moveAnimal, turnAnimal, animalTurn, throwError} from '../actions'

export default function () {
  return ({getState, dispatch}) => (next) => (action) => {
    if (action.type === moveAnimal.type) {
      const {game} = getState()
      const {levelSize, animals} = game
      const {id, getLocation} = action.payload
      const {lineNum} = action.meta
      const newLocation = getLocation(animals[id].current.location, animals[id].current.rot)
      checkBounds(newLocation, levelSize)
        ? dispatch(animalMove(id, newLocation, lineNum))
        : dispatch(throwError('Out of bounds', lineNum))
    }
    if (action.type === turnAnimal.type) {
      const {game} = getState()
      const {animals} = game
      const {id, turn} = action.payload
      const {lineNum} = action.meta
      const rot = animals[id].current.rot + turn
      dispatch(animalTurn(id, rot, lineNum))
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
