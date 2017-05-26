'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _mapValues = require('@f/map-values');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sequenceToCode(sequence) {
  return Array.isArray(sequence) ? blocksToCode(sequence) : sequence;
}

function blocksToCode(blocks) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var level = 0;

  return blocks.map(function (_ref) {
    var type = _ref.type,
        payload = _ref.payload;

    var args = (typeof payload === 'undefined' ? 'undefined' : (0, _typeof3.default)(payload)) === 'object' ? (0, _mapValues2.default)(function (v) {
      return v;
    }, payload).join(', ') : payload;
    var indent = tabs(level);

    switch (type) {
      case 'up':
        return indent + 'up(' + (args || 1) + ')';
      case 'left':
        return indent + 'left(' + (args || 1) + ')';
      case 'right':
        return indent + 'right(' + (args || 1) + ')';
      case 'down':
        return indent + 'down(' + (args || 1) + ')';
      case 'paint':
        return indent + 'paint("' + (args || 'black') + '")';
      case 'comment':
        return indent + '// ' + args;
      case 'move':
        return indent + 'forward(' + (args || 1) + ')';
      case 'forward':
        return indent + 'forward(' + (args || 1) + ')';
      case 'turnRight':
        return indent + 'turnRight()';
      case 'turnLeft':
        return indent + 'turnLeft()';
      case 'repeat':
        return tabs(level++) + 'repeat(' + payload[0] + ', function * () {';
      case 'block_end':
        return tabs(--level) + '})';
      case 'ifColor':
        return tabs(level++) + 'ifColor(\'' + payload[0] + '\', function * () {';
      default:
        throw new Error('blocksToCode: encountered unknown block type (' + type + ')');
    }
  }).join('\n');
}

function tabs(n) {
  var str = '';

  while (n--) {
    str += '\t';
  }return str;
}

exports.default = sequenceToCode;
