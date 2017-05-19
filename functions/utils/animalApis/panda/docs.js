'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range = require('@f/range');

var _range2 = _interopRequireDefault(_range);

var _comment = require('../comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  up: {
    usage: 'up(steps)',
    description: 'Move the panda up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the panda left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the panda right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the panda down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  paint: {
    usage: 'paint()',
    description: 'Paint the square the panda is currently on black.'
  },
  comment: _comment2.default
};