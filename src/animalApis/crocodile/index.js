import {
  paintSquare,
  moveAnimal,
  turnAnimal
} from '../../actions'

import {getDirection} from '../../utils'

import docs from './docs'

const imageURL = '/animalImages/crocodile.jpg'
const speed = 750

function wrap (id, getState = () => {}) {
  const move = (line) => moveCrocodile(line)
  const turnRight = (line) => turnAnimal({id, turn: 90}, line)
  const turnLeft = (line) => turnAnimal({id, turn: -90}, line)
  const paint = (line) => paintSquare({id, getPaintColor}, line)

  function moveCrocodile (lineNum) {
    return moveAnimal({id, getLocation: getNewLocation}, lineNum)
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

function getNewLocation (loc, rot) {
  const dir = getDirection(rot)
  if (dir === 0) {
    return [loc[0] - 1, loc[1]]
  } else if (dir === 2) {
    return [loc[0] + 1, loc[1]]
  } else if (dir === 3) {
    return [loc[0], loc[1] - 1]
  } else if (dir === 1) {
    return [loc[0], loc[1] + 1]
  }
}

export default wrap
export {
  docs,
  imageURL,
  speed
}
