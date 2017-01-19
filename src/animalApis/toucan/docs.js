import {range} from '../../utils'
import comment from '../comment'

export default {
  up: {
    usage: 'up(steps)',
    description: 'Move the toucan up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      default: 1,
      description: 'The number of steps up to move the toucan.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the toucan left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      default: 1,
      description: 'The number of steps left to move the toucan.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the toucan right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      default: 1,
      description: 'The number of steps right to move the toucan.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the toucan down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      default: 1,
      description: 'The number of steps down to move the toucan.'
    }]
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the toucan is currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      default: "'white'",
      values: 'color',
      description: 'The color to paint.'
    }]
  },
  comment
}
