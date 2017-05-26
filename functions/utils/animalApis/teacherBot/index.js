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

var imageURL = '/animalImages/chaos.png';
var gameImage = '/animalImages/chaostop.png';
var speed = 750;

function wrap(id) {
  var up = function up(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return moveAbsoluteDir(0, steps, lineNum);
  };
  var right = function right(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return moveAbsoluteDir(1, steps, lineNum);
  };
  var down = function down(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return moveAbsoluteDir(2, steps, lineNum);
  };
  var left = function left(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return moveAbsoluteDir(3, steps, lineNum);
  };
  var move = function move(lineNum) {
    var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return moveCrocodile(steps, lineNum);
  };
  var turnRight = function turnRight(lineNum) {
    return (0, _actions.animalTurn)(id, 90, lineNum);
  };
  var turnLeft = function turnLeft(lineNum) {
    return (0, _actions.animalTurn)(id, -90, lineNum);
  };
  var paint = function paint(lineNum) {
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'black';
    return (0, _actions.animalPaint)(id, color, lineNum);
  };
  var repeat = function repeat(lineNum, max, fn) {
    return (0, _actions.loopFn)(max, fn, lineNum);
  };
  var ifColor = function ifColor(lineNum, color, fn) {
    return (0, _actions.rawIfColor)(color, fn, lineNum);
  };

  function moveAbsoluteDir(dir, steps, lineNum) {
    return (0, _actions.animalMove)(id, (0, _animal.getNewLocation)(dir, steps), lineNum);
  }

  function moveCrocodile(steps, lineNum) {
    return (0, _actions.animalMove)(id, getCrocLocation(steps), lineNum);
  }

  return {
    up: up,
    rand: _actions.rand,
    right: right,
    down: down,
    left: left,
    paint: paint,
    repeat: repeat,
    ifColor: ifColor
  };
}

function getCrocLocation(steps) {
  return function (loc, rot) {
    var dir = getDirection(rot);

    switch (dir) {
      case 0:
        return [loc[0] - steps, loc[1]];
      case 1:
        return [loc[0], loc[1] + steps];
      case 2:
        return [loc[0] + steps, loc[1]];
      case 3:
        return [loc[0], loc[1] - steps];
    }
  };
}

exports.default = wrap;
exports.docs = _docs2.default;
exports.imageURL = imageURL;
exports.gameImage = gameImage;
exports.speed = speed;