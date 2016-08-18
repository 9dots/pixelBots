import sleep from '@f/sleep'
import {
  animalPaint,
  animalMove,
  moveError
} from '../actions'

function wrap (id, getState = () => {}) {
  const forward = () => move(0)
  const right = () => move(1)
  const back = () => move(2)
  const left = () => move(3)
  const paint = (color) => animalPaint(id, color)

  function move (dir) {
    const state = getState()
    const animal = state.animals[id]
    const location = getNewLocation(animal.current.location, dir)
    if (checkBounds(location, state.levelSize)) {
      return animalMove(id, location)
    } else {
      return moveError('Out of bounds')
    }
  }

  return {
    forward,
    right,
    back,
    left,
    paint
  }
}

function getNewLocation (oldLoc, dir) {
  if (dir === 0) {
    return [oldLoc[0] - 1, oldLoc[1]]
  } else if (dir === 2) {
    return [oldLoc[0] + 1, oldLoc[1]]
  } else if (dir === 3) {
    return [oldLoc[0], oldLoc[1] - 1]
  } else if (dir === 1) {
    return [oldLoc[0], oldLoc[1] + 1]
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

export default wrap
