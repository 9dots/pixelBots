import {animalMove, animalPaint, animalTurn} from '../actions'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/chameleon.jpg'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps = 1) => move(0, steps, lineNum)
  const right = (lineNum, steps = 1) => move(1, steps, lineNum)
  const down = (lineNum, steps = 1) => move(2, steps, lineNum)
  const left = (lineNum, steps = 1) => move(3, steps, lineNum)
  const paint = (lineNum, color) => animalPaint(id, color, lineNum)

  function move (dir, steps, lineNum) {
    return animalMove(id, getNewLocation(dir, steps), lineNum)
  }

  return {
    up,
    right,
    down,
    left,
    paint
  }
}

export default wrap
export {
  docs,
  imageURL,
  speed
}
