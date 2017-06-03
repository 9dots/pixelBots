'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _comment = require('../comment');

var _comment2 = _interopRequireDefault(_comment);

var _palette = require('../../palette');

var _palette2 = _interopRequireDefault(_palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  up: {
    usage: 'up(steps)',
    description: 'Move the toucan up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      values: (0, _range2.default)(1, 10),
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
      values: (0, _range2.default)(1, 10),
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
      values: (0, _range2.default)(1, 10),
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
      values: (0, _range2.default)(1, 10),
      default: 1,
      description: 'The number of steps down to move the toucan.'
    }]
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the toucan is currently on `color`.',
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