import {
  paintSquare,
  moveAnimal
} from 'pages/Game/middleware/botsMiddleware'

import docs from './docs'

const imageURL = '/animalImages/toucan.jpg'
const speed = 500

function wrap (id, getState = () => {}) {
  const up = (num, lineNum) => move(0, lineNum, parseInt(num))
  const right = (num, lineNum) => move(1, lineNum, parseInt(num))
  const down = (num, lineNum) => move(2, lineNum, parseInt(num))
  const left = (num, lineNum) => move(3, lineNum, parseInt(num))
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
