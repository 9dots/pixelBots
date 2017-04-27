import range from 'lodash/range'
import comment from '../comment'
import palette from 'utils/palette'

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
    description: 'Paint the square the toucan is currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      default: "white",
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
