import {animalMove, animalPaint, animalTurn} from '../actions'
import {getNewLocation} from 'utils/animal'
import {loopAction, loopFn} from '../loop'
import {ifColor} from '../check'
import docs from './docs'

const imageURL = '/animalImages/penguin.jpg'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps = 1) => move(0, steps, lineNum)
  const right = (lineNum, steps = 1) => move(1, steps, lineNum)
  const down = (lineNum, steps = 1) => move(2, steps, lineNum)
  const left = (lineNum, steps = 1) => move(3, steps, lineNum)
  const paint = (lineNum, color = 'black') => animalPaint(id, color, lineNum)
  const repeat = (lineNum, max, fn) => loopFn(max, fn)
  const if_color = (lineNum, color, fn) => ifColor(color, fn, lineNum)

  function move (dir, steps, lineNum) {
    return animalMove(id, getNewLocation(dir, steps), lineNum)
  }

  return {
    up,
    right,
    down,
    left,
    paint,
    repeat,
    if_color
  }
}

export default wrap
export {
  docs,
  imageURL,
  speed
}
