import {range} from '../../utils'

export default {
  up: {
    usage: 'up(steps)',
    description: 'Move the panda up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the panda left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the panda right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the panda down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  paint: {
    usage: 'paint()',
    description: 'Paint the square the panda is currently on black.'
  }
}
