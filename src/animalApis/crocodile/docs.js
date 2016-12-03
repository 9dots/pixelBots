import {range} from '../../utils'
import comment from '../comment'

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
    description: 'Turn the crocoidle 90 degrees to the left.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the crocodile is currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      values: 'color',
      description: 'The color to paint.'
    }]
  },
  comment
}
