import {
  paintSquare,
  moveAnimal
} from '../../actions'

import docs from './docs'

const imageURL = '/animalImages/panda.jpg'
const speed = 750

const colors = ['black', 'white']

function wrap (id, getState = () => {}) {
  const up = (line, num) => move(0, line, parseInt(num))
  const right = (line, num) => move(1, line, parseInt(num))
  const down = (line, num) => move(2, line, parseInt(num))
  const left = (line, num) => move(3, line, parseInt(num))
  const paint = (line) => paintSquare({id, getPaintColor}, line)

  function move (dir, lineNum, num) {
    return moveAnimal({id, getLocation: getNewLocation(dir, num)}, lineNum)
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

function getNewLocation (dir, num) {
  if (dir === 0) {  
    return (loc) => [loc[0] - num, loc[1]]
  } else if (dir === 2) {
    return (loc) => [loc[0] + num, loc[1]]
  } else if (dir === 3) {
    return (loc) => [loc[0], loc[1] - num]
  } else if (dir === 1) {
    return (loc) => [loc[0], loc[1] + num]
  }
}

export default wrap
export {
  docs,
  imageURL,
  speed
}
