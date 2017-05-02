import {animalMove, animalPaint, animalTurn} from '../actions'
import getDirection from 'pages/Game/utils/getDirection'
import docs from './docs'

const imageURL = '/animalImages/crocodile.jpg'
const speed = 750

function wrap (id) {
  const move = (lineNum, steps = 1) => moveCrocodile(steps, lineNum)
  const turnRight = (lineNum) => animalTurn(id, 90, lineNum)
  const turnLeft = (lineNum) => animalTurn(id, -90, lineNum)
  const paint = (lineNum, color) => animalPaint(id, color, lineNum)

  function moveCrocodile (steps, lineNum) {
    return animalMove(id, getNewLocation(steps), lineNum)
  }

  return {
    move,
    turnRight,
    turnLeft,
    paint
  }
}

function getPaintColor (state, id) {
  const painted = state.game.painted || {}
  const location = state.game.animals[id].current.location
  return painted[location] !== 'black' ? 'black' : 'white'
}

function getNewLocation (steps) {
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
