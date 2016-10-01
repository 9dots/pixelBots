import {
  animalPaint,
  animalMove,
  moveError
} from '../actions'

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
    usage: 'paint()',
    description: 'Paint the square the zebra is currently on black.'
  }
}

function wrap (id, getState = () => {}) {
  const up = (line) => move(0, line)
  const right = (line) => move(1, line)
  const down = (line) => move(2, line)
  const left = (line) => move(3, line)
  const paint = (line) => animalPaint(id, '#333', line)
  const speed = 750
  const imageURL = './animalImages/zebra.jpg'

  function move (dir, lineNum) {
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
    imageURL,
    docs
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
