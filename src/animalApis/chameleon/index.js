import {
  animalPaint,
  moveAnimal
} from '../../actions'

import docs from './docs'

const imageURL = '/animalImages/chameleon.jpg'
const speed = 750

function wrap (id, getState = () => {}) {
  const up = (line, num) => move(0, line, 1)
  const right = (line, num) => move(1, line, 1)
  const down = (line, num) => move(2, line, 1)
  const left = (line, num) => move(3, line, 1)
  const paint = (line, color) => animalPaint(id, color, line)

  function move (dir, lineNum, num) {
    return moveAnimal({id, getLocation: getNewLocation(dir, num)}, lineNum)
  }

  return {
    up,
    right,
    down,
    left,
    paint
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
  imageURL,
  speed
}
