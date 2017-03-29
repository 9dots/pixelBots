import {paintSquare, moveAnimal} from 'pages/Game/middleware/botsMiddleware'
import {getNewLocation} from 'utils/animal'
import {loopAction, loopFn} from '../loop'
import docs from './docs'

const imageURL = '/animalImages/penguin.png'
const speed = 750

function wrap (id) {
  const up = (steps, lineNum) => move(0, steps, lineNum)
  const right = (steps, lineNum) => move(1, steps, lineNum)
  const down = (steps, lineNum) => move(2, steps, lineNum)
  const left = (steps, lineNum) => move(3, steps, lineNum)
  const paint = (color, lineNum) => paintSquare({id, color, lineNum})
  const repeat = (max, fn, lineNum) => loopAction(loopFn(max, fn))

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