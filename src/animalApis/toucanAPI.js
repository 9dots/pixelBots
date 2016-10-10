import {
  animalPaint,
  moveAnimal
} from '../actions'

const imageURL = '/animalImages/toucan.jpg'
const docs = {
  up: {
    usage: 'up(num)',
    description: 'Move the toucan up `num` space.',
    arguments: ['number']
  },
  left: {
    usage: 'left(num)',
    description: 'Move the toucan left `num` space.',
    arguments: ['number']
  },
  right: {
    usage: 'right(num)',
    description: 'Move the toucan right `num` space.',
    arguments: ['number']
  },
  down: {
    usage: 'down(num)',
    description: 'Move the toucan down `num` space.',
    arguments: ['number']
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the toucan is currently on `color`.',
    arguments: ['string']
  }
}

function wrap (id, getState = () => {}) {
  const up = (line, num) => move(0, line, parseInt(num))
  const right = (line, num) => move(1, line, parseInt(num))
  const down = (line, num) => move(2, line, parseInt(num))
  const left = (line, num) => move(3, line, parseInt(num))
  const paint = (line, color) => animalPaint(id, color, line)
  const speed = 500

  function move (dir, lineNum, num) {
    return moveAnimal({id, getLocation: getNewLocation(dir, num)}, lineNum)
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

function getNewLocation (dir, num) {
  if (dir === 0) {
    return (loc) => [loc[0] - num, loc[1]]
  } else if (dir === 2) {
    return (loc) => [loc[0] + num, loc[1]]
  } else if (dir === 3) {
    return (loc) => [loc[0], loc[1] - num]
  } else if (dir === 1) {
    return (loc) => [loc[0], loc[1] + num]
  }
}

export default wrap
export {
  docs,
  imageURL
}
