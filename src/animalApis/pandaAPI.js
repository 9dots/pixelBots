import {
  animalPaint,
  moveAnimal
} from '../actions'

const imageURL = '/animalImages/panda.jpg'
const docs = {
  up: {
    usage: 'up(num)',
    description: 'Move the panda up `num` space.',
    arguments: ['number']
  },
  left: {
    usage: 'left(num)',
    description: 'Move the panda left `num` space.',
    arguments: ['number']
  },
  right: {
    usage: 'right(num)',
    description: 'Move the panda right `num` space.',
    arguments: ['number']
  },
  down: {
    usage: 'down(num)',
    description: 'Move the panda down `num` space.',
    arguments: ['number']
  },
  paint: {
    usage: 'paint()',
    description: 'Paint the square the panda is currently on black.'
  }
}

function wrap (id, getState = () => {}) {
  const up = (line, num) => move(0, line, parseInt(num))
  const right = (line, num) => move(1, line, parseInt(num))
  const down = (line, num) => move(2, line, parseInt(num))
  const left = (line, num) => move(3, line, parseInt(num))
  const paint = (line) => animalPaint(id, 'black', line)
  const speed = 750

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
