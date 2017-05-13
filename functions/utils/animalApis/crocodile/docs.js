'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _comment = require('../comment');

var _comment2 = _interopRequireDefault(_comment);

var _palette = require('../../palette');

var _palette2 = _interopRequireDefault(_palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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
      values: _palette2.default,
      description: 'The color to paint.'
    }]
  },
  comment: _comment2.default
};