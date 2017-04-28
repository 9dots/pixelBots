import range from 'lodash/range'
import comment from '../comment'

export default {
  up: {
    usage: 'up()',
    description: 'Move the penguin up one space.'
  },
  left: {
    usage: 'left()',
    description: 'Move the penguin left one space.'
  },
  right: {
    usage: 'right()',
    description: 'Move the penguin right one space.'
  },
  down: {
    usage: 'down()',
    description: 'Move the penguin down one space.'
  },
  paint: {
    usage: 'paint()',
    description: 'Paint the square the penguin is currently on black.'
  },
  repeat: {
    usage: 'repeat(num, function () {\n\t// code to repeat\n})',
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
