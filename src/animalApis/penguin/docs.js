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
  loop: {
    usage: 'for (var i = 0; i < n; i++) {\n\t\n}',
    description: 'Repeat the actions inside of the loop.'
  },
  comment
}
