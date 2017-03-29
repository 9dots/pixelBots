import {paintSquare, moveAnimal} from 'pages/Game/middleware/botsMiddleware'
import {getNewLocation} from 'utils/animal'
import docs from './docs'

const imageURL = '/animalImages/toucan.jpg'
const speed = 500

function wrap (id, getState = () => {}) {
  const up = (steps, lineNum) => move(0, steps, lineNum)
  const right = (steps, lineNum) => move(1, steps, lineNum)
  const down = (steps, lineNum) => move(2, steps, lineNum)
  const left = (steps, lineNum) => move(3, steps, lineNum)
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
