module.exports = {
  up: {
    usage: 'up()',
    description: 'Move the zebra up one space.'
  },
  left: {
    usage: 'left()',
    description: 'Move the zebra left one space.'
  },
  right: {
    usage: 'right()',
    description: 'Move the zebra right one space.'
  },
  down: {
    usage: 'down()',
    description: 'Move the zebra down one space.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the chameleon is currently on `color`.',
    example: "```js\npaint('yellow')\n```",
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      description: 'The color to paint.'
    }]
  }
}
