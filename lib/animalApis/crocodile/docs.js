import comment from '../comment'
import palette from 'utils/palette'

export default {
  move: {
    usage: 'move()',
    description: 'Move the crocodile one space in whichever direction it is facing.'
  },
  turnRight: {
    usage: 'turnRight()',
    description: 'Turn the crocodile 90 degrees to the right.'
  },
  turnLeft: {
    usage: 'turnLeft()',
    description: 'Turn the crocodile 90 degrees to the left.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the crocodile is currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint.'
    }]
  },
  comment
}
