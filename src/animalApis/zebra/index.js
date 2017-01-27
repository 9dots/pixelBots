import {
  paintSquare,
  moveAnimal
} from '../../actions'

import docs from './docs'

const imageURL = '/animalImages/zebra.jpg'
const speed = 750

function wrap (id) {
  const up = (line) => move(0, line)
  const right = (line) => move(1, line)
  const down = (line) => move(2, line)
  const left = (line) => move(3, line)
  const paint = (line) => paintSquare({id, getPaintColor}, line)

  function move (dir, lineNum) {
    return moveAnimal({id, getLocation: getNewLocation(dir)}, lineNum)
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
