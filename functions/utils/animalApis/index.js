'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.images = exports.teacherBot = exports.gameImages = exports.capabilities = exports.capabilityOrder = exports.typeColors = undefined

var _extends2 = require('babel-runtime/helpers/extends')

var _extends3 = _interopRequireDefault(_extends2)

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray')

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2)

var _keys = require('babel-runtime/core-js/object/keys')

var _keys2 = _interopRequireDefault(_keys)

var _regenerator = require('babel-runtime/regenerator')

var _regenerator2 = _interopRequireDefault(_regenerator)

exports.default = function (spec, id, palette) {
  console.log(spec)
  return (0, _mapObj2.default)(
    createActionFromSpec(id),
    createDocs(spec, palette)
  )
}

exports.createDocs = createDocs

var _createAction = require('@f/create-action')

var _createAction2 = _interopRequireDefault(_createAction)

var _palette = require('../palette')

var _palette2 = _interopRequireDefault(_palette)

var _filterObj = require('@f/filter-obj')

var _filterObj2 = _interopRequireDefault(_filterObj)

var _range = require('@f/range')

var _range2 = _interopRequireDefault(_range)

var _mapObj = require('@f/map-obj')

var _mapObj2 = _interopRequireDefault(_mapObj)

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var _marked = [checkColor, ifColor, loopFn, callFn].map(
  _regenerator2.default.mark
) /**
                                                                                      * Imports
                                                                                      */

/**
 * Images
 */

var animals = [
  'chameleon',
  'panda',
  'penguin',
  'crocodile',
  'teacherBot',
  'toucan'
]

var images = animals.reduce(function (acc, animal) {
  acc[animal] = '/animalImages/' + animal + '.png'
  return acc
}, {})

var gameImages = animals.reduce(function (acc, animal) {
  acc[animal] = '/animalImages/' + animal + 'top.png'
  return acc
}, {})

/**
 * Actions
 */

var getCurrentColor = (0, _createAction2.default)(
  'getCurrentColor',
  function () {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    return args
  }
)
var animalPaint = (0, _createAction2.default)('animalPaint', function () {
  for (
    var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
    _key2 < _len2;
    _key2++
  ) {
    args[_key2] = arguments[_key2]
  }

  return args
})
var animalMove = (0, _createAction2.default)('animalMove', function () {
  for (
    var _len3 = arguments.length, args = Array(_len3), _key3 = 0;
    _key3 < _len3;
    _key3++
  ) {
    args[_key3] = arguments[_key3]
  }

  return args
})
var animalTurn = (0, _createAction2.default)('animalTurn', function () {
  for (
    var _len4 = arguments.length, args = Array(_len4), _key4 = 0;
    _key4 < _len4;
    _key4++
  ) {
    args[_key4] = arguments[_key4]
  }

  return args
})
var toggle = (0, _createAction2.default)('toggle', function () {
  for (
    var _len5 = arguments.length, args = Array(_len5), _key5 = 0;
    _key5 < _len5;
    _key5++
  ) {
    args[_key5] = arguments[_key5]
  }

  return args
})
var paintT = (0, _createAction2.default)('paintT', function () {
  for (
    var _len6 = arguments.length, args = Array(_len6), _key6 = 0;
    _key6 < _len6;
    _key6++
  ) {
    args[_key6] = arguments[_key6]
  }

  return args
})
var paintL = (0, _createAction2.default)('paintL', function () {
  for (
    var _len7 = arguments.length, args = Array(_len7), _key7 = 0;
    _key7 < _len7;
    _key7++
  ) {
    args[_key7] = arguments[_key7]
  }

  return args
})
var paintJ = (0, _createAction2.default)('paintJ', function () {
  for (
    var _len8 = arguments.length, args = Array(_len8), _key8 = 0;
    _key8 < _len8;
    _key8++
  ) {
    args[_key8] = arguments[_key8]
  }

  return args
})
var paintS = (0, _createAction2.default)('paintS', function () {
  for (
    var _len9 = arguments.length, args = Array(_len9), _key9 = 0;
    _key9 < _len9;
    _key9++
  ) {
    args[_key9] = arguments[_key9]
  }

  return args
})
var paintZ = (0, _createAction2.default)('paintZ', function () {
  for (
    var _len10 = arguments.length, args = Array(_len10), _key10 = 0;
    _key10 < _len10;
    _key10++
  ) {
    args[_key10] = arguments[_key10]
  }

  return args
})
var paintO = (0, _createAction2.default)('paintO', function () {
  for (
    var _len11 = arguments.length, args = Array(_len11), _key11 = 0;
    _key11 < _len11;
    _key11++
  ) {
    args[_key11] = arguments[_key11]
  }

  return args
})
var paintI = (0, _createAction2.default)('paintI', function () {
  for (
    var _len12 = arguments.length, args = Array(_len12), _key12 = 0;
    _key12 < _len12;
    _key12++
  ) {
    args[_key12] = arguments[_key12]
  }

  return args
})
var setLine = (0, _createAction2.default)('setActiveLine', function () {
  for (
    var _len13 = arguments.length, args = Array(_len13), _key13 = 0;
    _key13 < _len13;
    _key13++
  ) {
    args[_key13] = arguments[_key13]
  }

  return args
})
var rand = (0, _createAction2.default)('createRand', function () {
  for (
    var _len14 = arguments.length, args = Array(_len14), _key14 = 0;
    _key14 < _len14;
    _key14++
  ) {
    args[_key14] = arguments[_key14]
  }

  return args
})

function checkColor (lineNum, color) {
  var a
  return _regenerator2.default.wrap(
    function checkColor$ (_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2
            return getCurrentColor(lineNum)

          case 2:
            a = _context.sent
            return _context.abrupt('return', a === color)

          case 4:
          case 'end':
            return _context.stop()
        }
      }
    },
    _marked[0],
    this
  )
}

function ifColor (lineNum, color, fn) {
  return _regenerator2.default.wrap(
    function ifColor$ (_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            _context2.next = 2
            return checkColor(lineNum, color)

          case 2:
            if (!_context2.sent) {
              _context2.next = 4
              break
            }

            return _context2.delegateYield(fn(), 't0', 4)

          case 4:
          case 'end':
            return _context2.stop()
        }
      }
    },
    _marked[1],
    this
  )
}

function loopFn (lineNum, max, fn) {
  var i
  return _regenerator2.default.wrap(
    function loopFn$ (_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            i = 0

          case 1:
            if (!(i < max)) {
              _context3.next = 8
              break
            }

            _context3.next = 4
            return setLine(lineNum)

          case 4:
            return _context3.delegateYield(fn(i), 't0', 5)

          case 5:
            i++
            _context3.next = 1
            break

          case 8:
          case 'end':
            return _context3.stop()
        }
      }
    },
    _marked[2],
    this
  )
}

function callFn (lineNum, fn) {
  for (
    var _len15 = arguments.length,
      args = Array(_len15 > 2 ? _len15 - 2 : 0),
      _key15 = 2;
    _key15 < _len15;
    _key15++
  ) {
    args[_key15 - 2] = arguments[_key15]
  }

  return _regenerator2.default.wrap(
    function callFn$ (_context4) {
      while (1) {
        switch ((_context4.prev = _context4.next)) {
          case 0:
            _context4.next = 2
            return setLine(lineNum)

          case 2:
            return _context4.delegateYield(fn.apply(undefined, args), 't0', 3)

          case 3:
          case 'end':
            return _context4.stop()
        }
      }
    },
    _marked[3],
    this
  )
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
  faceNorth: {
    type: 'move',
    description: 'Turn the pixelbot to face north.'
  },
  up: {
    type: 'move',
    description: 'Move the pixelbot up <%= args[0] %> space.',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  left: {
    type: 'move',
    description: 'Move the pixelbot left <%= args[0] %> space.',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  right: {
    type: 'move',
    description: 'Move the pixelbot right <%= args[0] %> space.',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  down: {
    type: 'move',
    description: 'Move the pixelbot down <%= args[0] %> space.',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  paint: {
    type: 'paint',
    description:
      'Paint the square the pixelbot is currently on <%= args[0] %>.',
    defaultArgs: ['black'],
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint.'
      }
    ]
  },
  toggle: {
    type: 'paint',
    description: 'Toggle between blue and yellow.'
  },
  paintT: {
    type: 'paint',
    description: 'Paint a T tetris shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintL: {
    type: 'paint',
    description: 'Paint an L tetris shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintO: {
    type: 'paint',
    description: 'Paint an O shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintI: {
    type: 'paint',
    description: 'Paint an I shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintS: {
    type: 'paint',
    description: 'Paint an S shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintZ: {
    type: 'paint',
    description: 'Paint an Z shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  paintJ: {
    type: 'paint',
    description: 'Paint an J shape.',
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'black',
        values: _palette2.default,
        description: 'The color to paint'
      }
    ]
  },
  comment: {
    type: 'comment',
    usage: '// comment',
    description: 'Add a comment.'
  },
  repeat: {
    type: 'control',
    description: 'Repeat the actions inside of the loop `num` times.',
    block: true,
    args: [
      {
        name: 'num',
        type: 'number',
        default: 2,
        values: (0, _range2.default)(1, 10),
        description: 'The number of times to repeat the loop.'
      },
      {
        name: '() => {\n\t// code to repeat\n}',
        type: 'function',
        values: null,
        description: 'The function to be repeated'
      }
    ]
  },
  block_end: {
    type: 'control',
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  ifColor: {
    type: 'control',
    description: 'conditional block',
    block: true,
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'white',
        values: _palette2.default,
        description: 'The color to match'
      },
      {
        name: '() => {\n\t// code to execute\n\t// if the color matches\n}',
        type: 'function',
        default: null,
        values: null,
        description: 'The function to conditionally execute'
      }
    ]
  },
  turnRight: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the right.',
    args: [
      {
        name: 'turns',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 4),
        description: 'The number of turns right for the pixelbot to make.'
      }
    ]
  },
  turnLeft: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the left.',
    args: [
      {
        name: 'turns',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 4),
        description: 'The number of turns left for the pixelbot to make.'
      }
    ]
  },
  forward: {
    type: 'move',
    description:
      'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: (0, _range2.default)(1, 10),
        description: 'The number of steps forward to move the pixelbot.'
      }
    ]
  },
  moveTo: {
    type: 'move',
    description: 'Move the pixelbot to a specific coordinate (x, y).',
    defaultArgs: [0, 0],
    args: [
      {
        name: 'x',
        type: 'number',
        default: 0,
        values: (0, _range2.default)(0, 19),
        description: 'The x coordinate to move to.'
      },
      {
        name: 'y',
        type: 'number',
        default: 0,
        values: (0, _range2.default)(0, 19),
        description: 'The y coordinate to move to.'
      }
    ]
  },
  rand: {
    type: null,
    description: 'Generate a random number',
    args: [
      {
        name: 'min',
        type: 'number',
        default: 0,
        description: 'The minimum for the random number'
      },
      {
        name: 'max',
        type: 'number'
      }
    ]
  },
  createFunction: {
    type: 'functions',
    block: true,
    description: 'Create a new function'
  },
  userFn: {
    hidden: true,
    block: true,
    type: 'functions'
  },
  callFn: {
    hidden: true
  },
  setLine: {
    hidden: true
  }
}

var hasAction = {
  repeat: loopFn,
  ifColor: ifColor,
  callFn: callFn
}

var teacherBot = (0, _keys2.default)(capabilities).reduce(function (acc, key) {
  acc[key] = capabilities[key].args ? [true] : true
  return acc
}, {})

var typeColors = {
  move: 'green',
  control: '#bd1317',
  paint: 'blue'
}

var capabilityOrder = [
  'up',
  'left',
  'right',
  'down',
  'forward',
  'moveTo',
  'turnRight',
  'turnLeft',
  'paint',
  'toggle',
  'paintO',
  'paintI',
  'paintS',
  'paintZ',
  'paintL',
  'paintJ',
  'paintT',
  'repeat',
  'block_end',
  'ifColor',
  'rand',
  'comment'
]

/**
 * Exports
 */

function createArgumentsFromSpec (id, spec, name) {
  return function (lineNum) {
    for (
      var _len16 = arguments.length,
        args = Array(_len16 > 1 ? _len16 - 1 : 0),
        _key16 = 1;
      _key16 < _len16;
      _key16++
    ) {
      args[_key16 - 1] = arguments[_key16]
    }

    return [lineNum, id].concat(
      (0, _toConsumableArray3.default)(
        spec.args.map(function (aspec, i) {
          if (
            aspec.name === 'color' &&
            aspec.values &&
            aspec.values.filter(function (arg) {
              return arg === args[i] || arg.name === args[i]
            }).length === 0
          ) {
            return aspec.default
          }

          return args[i]
        })
      )
    )
  }
}

function createActionFromSpec (id) {
  return function (spec, key) {
    if (hasAction[key]) {
      return hasAction[key]
    } else {
      return (0, _createAction2.default)(
        key,
        createArgumentsFromSpec(id, spec, key)
      )
    }
  }
}

function createDocs (traits, palette) {
  return (0, _mapObj2.default)(
    function (val, key) {
      return traits[key] === true || key === 'comment'
        ? (0, _extends3.default)({}, val, { args: [] })
        : (0, _extends3.default)({}, val, {
          args: (val.args || []).map(function (arg, i) {
            return (0, _extends3.default)({}, arg, {
              values:
                  (traits[key][i] === true
                    ? arg.name === 'color' ? palette : arg.values || true
                    : traits[key][i]) || null
            })
          })
        })
    },
    (0, _extends3.default)(
      {},
      (0, _filterObj2.default)(function (val, key) {
        return traits[key]
      }, capabilities),
      {
        comment: capabilities.comment,
        setLine: capabilities.setLine,
        callFn: capabilities.callFn
      }
    )
  )
}

exports.typeColors = typeColors
exports.capabilityOrder = capabilityOrder
exports.capabilities = capabilities
exports.gameImages = gameImages
exports.teacherBot = teacherBot
exports.images = images
