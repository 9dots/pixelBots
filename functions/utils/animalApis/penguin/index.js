'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speed = exports.gameImage = exports.imageURL = exports.docs = undefined;

var _actions = require('../actions');

var _animal = require('utils/animal');

var _docs = require('./docs');

var _docs2 = _interopRequireDefault(_docs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageURL = '/animalImages/penguin.png';
var gameImage = '/animalImages/penguintop.png';
var speed = 750;

function wrap(id) {
  var up = function up(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return move(0, steps, lineNum);
  };
  var right = function right(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return move(1, steps, lineNum);
  };
  var down = function down(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return move(2, steps, lineNum);
  };
  var left = function left(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return move(3, steps, lineNum);
  };
  var paint = function paint(lineNum) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
    return (0, _actions.animalPaint)(id, color, lineNum);
  };
  var repeat = function repeat(lineNum, max, fn) {
    return (0, _actions.loopFn)(max, fn, lineNum);
  };
  var ifColor = function ifColor(lineNum, color, fn) {
    return (0, _actions.ifColor)(color, fn, lineNum);
  };

  function move(dir, steps, lineNum) {
    return (0, _actions.animalMove)(id, (0, _animal.getNewLocation)(dir, steps), lineNum);
  }

  console.log('id', id);

  return {
    up: up,
    right: right,
    down: down,
    left: left,
    paint: paint,
    repeat: repeat,
    ifColor: ifColor
  };
}

exports.default = wrap;
exports.docs = _docs2.default;
exports.imageURL = imageURL;
exports.gameImage = gameImage;
exports.speed = speed;