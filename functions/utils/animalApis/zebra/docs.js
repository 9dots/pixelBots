'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _comment = require('../comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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
    usage: 'paint()',
    description: 'Paint the square the zebra is currently on black.'
  },
  comment: _comment2.default
};