export default {
  up: {
    usage: 'up(steps)',
    description: 'Move the panda up `steps` space.',
    arguments: [{
      name: 'up(*steps*)',
      type: 'number',
      description: 'The number of steps right to move the toucan.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the panda left `steps` space.',
    arguments: [{
      name: 'left(*steps*)',
      type: 'number',
      description: 'The number of steps right to move the toucan.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the panda right `steps` space.',
    arguments: [{
      name: 'right(*steps*)',
      type: 'number',
      description: 'The number of steps right to move the toucan.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the panda down `steps` space.',
    arguments: [{
      name: 'down(*steps*)',
      type: 'number',
      description: 'The number of steps right to move the toucan.'
    }]
  },
  paint: {
    usage: 'paint()',
    description: 'Paint the square the panda is currently on black.'
  }
}
