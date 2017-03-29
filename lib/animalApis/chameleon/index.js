import {paintSquare, moveAnimal} from 'pages/Game/middleware/botsMiddleware'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/chameleon.jpg'
const speed = 750

function wrap (id) {
  const up = (lineNum, steps) => move(0, steps, lineNum)
  const right = (lineNum, steps) => move(1, steps, lineNum)
  const down = (lineNum, steps) => move(2, steps, lineNum)
  const left = (lineNum, steps) => move(3, steps, lineNum)
  const paint = (lineNum, color) => paintSquare({id, color, lineNum})

  function move (dir, steps, lineNum) {
    return moveAnimal({id, getLocation: getNewLocation(dir, steps), lineNum})
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
