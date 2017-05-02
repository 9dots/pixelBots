import {animalMove, animalPaint, animalTurn} from '../actions'
import {getNewLocation} from 'utils/animal'

const docs = {
  up: {
    usage: 'up()',
    description: 'Move the zebra up one space.'
  },
  left: {
    usage: 'left()',
    description: 'Move the zebra left one space.'
  },
  right: {
    usage: 'right()',
    description: 'Move the zebra right one space.'
  },
  down: {
    usage: 'down()',
    description: 'Move the zebra down one space.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the zebra is currently on color.',
    args: 'color'
  }
}

function wrap (id) {
  const up = (steps, lineNum) => move(0, steps, lineNum)
  const right = (steps, lineNum) => move(1, steps, lineNum)
  const down = (steps, lineNum) => move(2, steps, lineNum)
  const left = (steps, lineNum) => move(3, steps, lineNum)
  const paint = (lineNum, color) => animalPaint(id, color, lineNum)
  const speed = 750

  function move (dir, steps, lineNum) {
    const state = getState()
    const animal = state.animals[id]
    const location = getNewLocation(animal.current.location, dir)

    if (checkBounds(location, state.levelSize)) {
      return animalMove(id, location, lineNum)
    } else {
      return moveError('Out of bounds', lineNum)
    }
  }

  return {
    up,
    right,
    down,
    left,
    paint,
    speed,
    docs
  }
}

export default wrap
export {
  docs
}
