import {
  animalPaint,
  moveAnimal
} from '../actions'

const imageURL = './animalImages/zebra.jpg'
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

  function move (dir, lineNum) {
    return moveAnimal({id, getLocation: getNewLocation(dir)}, lineNum)
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

function getNewLocation (dir) {
  if (dir === 0) {
    return (loc) => [loc[0] - 1, loc[1]]
  } else if (dir === 2) {
    return (loc) => [loc[0] + 1, loc[1]]
  } else if (dir === 3) {
    return (loc) => [loc[0], loc[1] - 1]
  } else if (dir === 1) {
    return (loc) => [loc[0], loc[1] + 1]
  }
}

export default wrap
export {
  docs,
  imageURL
}
