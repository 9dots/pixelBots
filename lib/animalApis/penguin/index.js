import {animalMove, animalPaint, animalTurn, loopFn, ifColor as rawIfColor} from '../actions'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/penguin.png'
const gameImage = '/animalImages/penguintop.png'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps = 1) => move(0, steps, lineNum)
  const right = (lineNum, steps = 1) => move(1, steps, lineNum)
  const down = (lineNum, steps = 1) => move(2, steps, lineNum)
  const left = (lineNum, steps = 1) => move(3, steps, lineNum)
  const paint = (lineNum, color = 'black') => animalPaint(id, color, lineNum)
  const repeat = (lineNum, max, fn) => loopFn(max, fn, lineNum)
  const ifColor = (lineNum, color, fn) => rawIfColor(color, fn, lineNum)

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
    ifColor
  }
}

export default wrap
export {
  docs,
  imageURL,
  gameImage,
  speed
}
