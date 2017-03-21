import {
  paintSquare,
  moveAnimal
} from 'pages/Game/middleware/botsMiddleware'

import docs from './docs'

const imageURL = '/animalImages/panda.jpg'
const speed = 750

const colors = ['black', 'white']

function wrap (id) {
  const up = (num, lineNum) => move(0, lineNum, parseInt(num))
  const right = (num, lineNum) => move(1, lineNum, parseInt(num))
  const down = (num, lineNum) => move(2, lineNum, parseInt(num))
  const left = (num, lineNum) => move(3, lineNum, parseInt(num))
  const paint = (lineNum) => paintSquare({id, color: 'black', lineNum})

  function move (dir, lineNum, num) {
    return moveAnimal({id, getLocation: getNewLocation(dir, num), lineNum})
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
