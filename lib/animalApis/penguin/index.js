import {
  paintSquare,
  moveAnimal
} from 'pages/Game/middleware/botsMiddleware'

import {loopAction, loopFn} from '../loop'
import docs from './docs'

const imageURL = '/animalImages/penguin.png'
const speed = 750

function wrap (id) {
  const up = (lineNum) => move(0, lineNum)
  const right = (lineNum) => move(1, lineNum)
  const down = (lineNum) => move(2, lineNum)
  const left = (lineNum) => move(3, lineNum)
  const paint = (color, lineNum) => paintSquare({id, color, lineNum})
  const repeat = (max, fn, lineNum) => loopAction(loopFn(max, fn))

  function move (dir, lineNum) {
    return moveAnimal({id, getLocation: getNewLocation(dir), lineNum})
  }

  return {
    up,
    right,
    down,
    left,
    paint,
    repeat
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
  imageURL,
  speed
}
