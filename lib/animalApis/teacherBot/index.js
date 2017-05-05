import {animalMove, animalPaint, animalTurn, loopFn, rawIfColor, rand} from '../actions'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/penguin.jpg'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps = 1) => moveAbsoluteDir(0, steps, lineNum)
  const right = (lineNum, steps = 1) => moveAbsoluteDir(1, steps, lineNum)
  const down = (lineNum, steps = 1) => moveAbsoluteDir(2, steps, lineNum)
  const left = (lineNum, steps = 1) => moveAbsoluteDir(3, steps, lineNum)
  const move = (lineNum, steps = 1) => moveCrocodile(steps, lineNum)
  const turnRight = (lineNum) => animalTurn(id, 90, lineNum)
  const turnLeft = (lineNum) => animalTurn(id, -90, lineNum)
  const paint = (lineNum, color = 'black') => animalPaint(id, color, lineNum)
  const repeat = (lineNum, max, fn) => loopFn(max, fn, lineNum)
  const ifColor = (lineNum, color, fn) => rawIfColor(color, fn, lineNum)

  function moveAbsoluteDir (dir, steps, lineNum) {
    return animalMove(id, getNewLocation(dir, steps), lineNum)
  }

  function moveCrocodile(steps, lineNum) {
    return animalMove(id, getCrocLocation(steps), lineNum)
  }

  return {
    up,
    rand,
    right,
    down,
    left,
    paint,
    repeat,
    ifColor
  }
}

function getCrocLocation (steps) {
  return (loc, rot) => {
    const dir = getDirection(rot)

    switch (dir) {
      case 0:
        return [loc[0] - steps, loc[1]]
      case 1:
        return [loc[0], loc[1] + steps]
      case 2:
        return [loc[0] + steps, loc[1]]
      case 3:
        return [loc[0], loc[1] - steps]
    }
  }
}

export default wrap
export {
  docs,
  imageURL,
  speed
}
