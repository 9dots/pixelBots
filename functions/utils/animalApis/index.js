'use strict';

require('regenerator-runtime/runtime').default

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.images = exports.teacherBot = exports.gameImages = exports.capabilities = exports.capabilityOrder = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = function (spec, id) {
  return (0, _mapObj2.default)(function (params, key) {
    return hasAction[key] ? hasAction[key] : (0, _createAction2.default)(key, function (lineNum) {
      for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
        args[_key7 - 1] = arguments[_key7];
      }

      return [lineNum, id].concat(args);
    });
  }, spec);
};

exports.createDocs = createDocs;

var _createAction = require('@f/create-action');

var _createAction2 = _interopRequireDefault(_createAction);

var _palette = require('../palette');

var _palette2 = _interopRequireDefault(_palette);

var _filterObj = require('@f/filter-obj');

var _filterObj2 = _interopRequireDefault(_filterObj);

var _range = require('@f/range');

var _range2 = _interopRequireDefault(_range);

var _mapObj = require('@f/map-obj');

var _mapObj2 = _interopRequireDefault(_mapObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [checkColor, ifColor, loopFn].map(_regenerator2.default.mark); /**
                                                                              * Imports
                                                                              */

/**
 * Images
 */

var animals = ['chameleon', 'panda', 'penguin', 'crocodile', 'teacherBot', 'toucan'];

var images = animals.reduce(function (acc, animal) {
  acc[animal] = '/animalImages/' + animal + '.png';
  return acc;
}, {});

var gameImages = animals.reduce(function (acc, animal) {
  acc[animal] = '/animalImages/' + animal + 'top.png';
  return acc;
}, {});

/**
 * Actions
 */

var getCurrentColor = (0, _createAction2.default)('getCurrentColor', function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
});
var animalPaint = (0, _createAction2.default)('animalPaint', function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args;
});
var animalMove = (0, _createAction2.default)('animalMove', function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args;
});
var animalTurn = (0, _createAction2.default)('animalTurn', function () {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return args;
});
var setLine = (0, _createAction2.default)('setActiveLine', function () {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return args;
});
var rand = (0, _createAction2.default)('createRand', function () {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return args;
});

function checkColor(lineNum, color) {
  return _regenerator2.default.wrap(function checkColor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getCurrentColor(lineNum);

        case 2:
          _context.t0 = _context.sent;
          _context.t1 = color;
          return _context.abrupt('return', _context.t0 === _context.t1);

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function ifColor(lineNum, color, fn) {
  return _regenerator2.default.wrap(function ifColor$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return checkColor(lineNum, color);

        case 2:
          if (!_context2.sent) {
            _context2.next = 5;
            break;
          }

          _context2.next = 5;
          return fn();

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function loopFn(lineNum, max, fn) {
  var i;
  return _regenerator2.default.wrap(function loopFn$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < max)) {
            _context3.next = 8;
            break;
          }

          _context3.next = 4;
          return setLine(lineNum);

        case 4:
          return _context3.delegateYield(fn(i), 't0', 5);

        case 5:
          i++;
          _context3.next = 1;
          break;

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}

/**
 * Capabilities
 *
 * up/right/down/left - parameterless
 * up/right/down/left - with `steps` argument
 * paint - parameterless (black/white)
 * paint - with `color` argument
 * for loops
 * while loops
 * color conditionals
 * ??? conditionals
 * chess movements
 * toggle bot
 */

var capabilities = {
  up: {
    usage: 'up(steps)',
    description: 'Move the pixelbot up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the pixelbot left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the pixelbot right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the pixelbot down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: (0, _range2.default)(1, 10),
      description: 'The number of steps right to move the pixelbot.'
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
  comment: {
    usage: '// comment',
    description: 'Add a comment.'
  },
  repeat: {
    usage: 'repeat(n, function(){\n\t// code to repeat\n})',
    description: 'Repeat the actions inside of the loop.',
    block: true,
    args: [{
      name: 'num',
      type: 'number',
      default: 2,
      values: (0, _range2.default)(1, 10),
      description: 'The number of times to repeat the loop.'
    }, {
      name: 'fn',
      type: 'function',
      values: null,
      description: 'The function to be repeated'
    }]
  },
  block_end: {
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  ifColor: {
    usage: 'ifColor(color, function(){\n\t// code to execute\n\t// if the color matches\n})',
    description: 'conditional block',
    block: true,
    args: [{
      name: 'color',
      type: 'string',
      default: 'white',
      values: _palette2.default,
      description: 'The color to match'
    }]
  },
  turnRight: {
    usage: 'turnRight()',
    description: 'Turn the pixelbot 90 degrees to the right.'
  },
  turnLeft: {
    usage: 'turnLeft()',
    description: 'Turn the pixelbot 90 degrees to the left.'
  },
  forward: {
    usage: 'forward()',
    description: 'Move the pixelbot one space in whichever direction it is facing.'
  },
  rand: {
    usage: 'rand(min, max)',
    description: 'Generate a random number',
    args: [{
      name: 'min',
      type: 'number',
      default: 0,
      description: 'The minimum for the random number'
    }, {
      name: 'max',
      type: 'number'
    }]
  }
};

var hasAction = {
  repeat: loopFn,
  ifColor: ifColor
};

var teacherBot = (0, _keys2.default)(capabilities).reduce(function (acc, key) {
  acc[key] = capabilities[key].args ? capabilities[key].args.map(function (a) {
    return a.values;
  }) : true;
  return acc;
}, {});

var capabilityOrder = ['up', 'left', 'right', 'down', 'turnRight', 'turnLeft', 'forward', 'paint', 'comment', 'repeat', 'block_end', 'ifColor', 'rand'];

/**
 * Exports
 */

function createDocs(traits) {
  return (0, _mapObj2.default)(function (val, key) {
    return traits[key] === true ? (0, _extends3.default)({}, val, { args: [] }) : (0, _extends3.default)({}, val, {
      args: (val.args || []).map(function (arg, i) {
        return (0, _extends3.default)({}, arg, {
          values: (traits[key][i] === true ? arg.values : traits[key][i]) || null
        });
      })
    });
  }, (0, _filterObj2.default)(function (val, key) {
    return traits[key];
  }, capabilities));
}

exports.capabilityOrder = capabilityOrder;
exports.capabilities = capabilities;
exports.gameImages = gameImages;
exports.teacherBot = teacherBot;
exports.images = images;
