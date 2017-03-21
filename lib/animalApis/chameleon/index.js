import {
  paintSquare,
  moveAnimal
} from 'pages/Game/middleware/botsMiddleware'

import docs from './docs'

const imageURL = '/animalImages/chameleon.jpg'
const speed = 750

function wrap (id) {
  const up = (num, lineNum) => move(0, lineNum, 1)
  const right = (num, lineNum) => move(1, lineNum, 1)
  const down = (num, lineNum) => move(2, lineNum, 1)
  const left = (num, lineNum) => move(3, lineNum, 1)
  const paint = (color, lineNum) => paintSquare({id, color, lineNum})

  function move (dir, lineNum, num) {
    return moveAnimal({id, getLocation: getNewLocation(dir, num), lineNum})
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
