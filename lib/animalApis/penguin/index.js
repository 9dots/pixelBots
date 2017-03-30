import {paintSquare, moveAnimal} from 'pages/Game/middleware/botsMiddleware'
import {getNewLocation} from 'utils/animal'
import {loopAction, loopFn} from '../loop'
import docs from './docs'

const imageURL = '/animalImages/penguin.png'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps = 1) => move(0, steps, lineNum)
  const right = (lineNum, steps = 1) => move(1, steps, lineNum)
  const down = (lineNum, steps = 1) => move(2, steps, lineNum)
  const left = (lineNum, steps = 1) => move(3, steps, lineNum)
  const paint = (lineNum, color) => paintSquare({id, color, lineNum})
  const repeat = (lineNum, max, fn) => loopAction(loopFn(max, fn))

  function move (dir, steps, lineNum) {
    return moveAnimal({id, getLocation: getNewLocation(dir, steps), lineNum})
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

export default wrap
export {
  docs,
  imageURL,
  speed
}