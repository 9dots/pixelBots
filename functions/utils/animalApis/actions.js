'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.rand = exports.loopFn = exports.ifColor = exports.animalTurn = exports.animalMove = exports.animalPaint = undefined

var _regenerator = require('babel-runtime/regenerator')

var _regenerator2 = _interopRequireDefault(_regenerator)

var _createAction = require('@f/create-action')

var _createAction2 = _interopRequireDefault(_createAction)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var _marked = [checkColor, ifColor, loopFn].map(_regenerator2.default.mark) /**
                                                                              * Imports
                                                                              */

/**
 * Actions
 */

var getCurrentColor = (0, _createAction2.default)('getCurrentColor', function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key]
  }

  return args
})
var animalPaint = (0, _createAction2.default)('animalPaint', function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2]
  }

  return args
})
var animalMove = (0, _createAction2.default)('animalMove', function () {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3]
  }

  return args
})
var animalTurn = (0, _createAction2.default)('animalTurn', function () {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4]
  }

  return args
})
var setLine = (0, _createAction2.default)('setActiveLine', function () {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5]
  }

  return args
})
var rand = (0, _createAction2.default)('createRand', function () {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6]
  }

  return args
})

/**
 * Functions
 */

function checkColor (color, lineNum) {
  return _regenerator2.default.wrap(function checkColor$ (_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2
          return getCurrentColor(lineNum)

        case 2:
          _context.t0 = _context.sent
          _context.t1 = color
          return _context.abrupt('return', _context.t0 === _context.t1)

        case 5:
        case 'end':
          return _context.stop()
      }
    }
  }, _marked[0], this)
}

function ifColor (color, fn, lineNum) {
  return _regenerator2.default.wrap(function ifColor$ (_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2
          return checkColor(color, lineNum)

        case 2:
          if (!_context2.sent) {
            _context2.next = 5
            break
          }

          _context2.next = 5
          return fn()

        case 5:
        case 'end':
          return _context2.stop()
      }
    }
  }, _marked[1], this)
}

function loopFn (max, fn, lineNum) {
  var i
  return _regenerator2.default.wrap(function loopFn$ (_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          i = 0

        case 1:
          if (!(i < max)) {
            _context3.next = 8
            break;
          }

          _context3.next = 4
          return setLine(lineNum)

        case 4:
          return _context3.delegateYield(fn(), 't0', 5)

        case 5:
          i++
          _context3.next = 1
          break;

        case 8:
        case 'end':
          return _context3.stop()
      }
    }
  }, _marked[2], this)
}

/**
 * Exports
 */

exports.animalPaint = animalPaint
exports.animalMove = animalMove
exports.animalTurn = animalTurn
exports.ifColor = ifColor
exports.loopFn = loopFn
exports.rand = rand
