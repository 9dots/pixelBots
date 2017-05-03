import range from 'lodash/range'
import comment from '../comment'
import palette from 'utils/palette'

export default {
  up: {
    usage: 'up(steps)',
    description: 'Move up `steps` squares.',
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
    description: 'Move left `steps` squares.',
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
    description: 'Move right `steps` squares.',
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
    description: 'Move down `steps` squares.',
    args: [{
      name: 'steps',
      type: 'number',
      values: range(1, 10),
      default: 1,
      description: 'The number of steps down to move the toucan.'
    }]
  },
  move: {
    usage: 'move()',
    description: 'Move your cursor in whatever direction it is facing.'
  },
  turnRight: {
    usage: 'turnRight()',
    description: 'Turn right 90 degrees.'
  },
  turnLeft: {
    usage: 'turnLeft()',
    description: 'Turn left 90 degrees.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square you are currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint.'
    }]
  },
  repeat: {
    usage: 'repeat(n, function(){\n\t// code to repeat\n})',
    description: 'Repeat the actions inside of the loop.',
    args: [{
      name: 'num',
      type: 'number',
      default: 2,
      values: range(1, 10),
      description: 'The number of times to repeat the loop.'
    },
    {
      name: 'fn',
      type: 'function',
      description: 'The function to be repeated'
    }]
  },
  repeat_end: {
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  comment
}
