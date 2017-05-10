import {animalMove, animalPaint, animalTurn} from '../actions'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/panda.png'
const gameImage = '/animalImages/pandatop.png'
const speed = 750

const colors = ['black', 'white']

function wrap (id) {
  const up = (lineNum, steps = 1) => move(0, steps, lineNum)
  const right = (lineNum, steps = 1) => move(1, steps, lineNum)
  const down = (lineNum, steps = 1) => move(2, steps, lineNum)
  const left = (lineNum, steps = 1) => move(3, steps, lineNum)
  const paint = (lineNum) => animalPaint(id, 'black', lineNum)

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

function getPaintColor (state, id) {
  const painted = state.game.painted || {}
  const location = state.game.animals[id].current.location
  return painted[location] !== 'black' ? 'black' : 'white'
}

export default wrap
export {
  docs,
  imageURL,
  gameImage,
  speed
}
