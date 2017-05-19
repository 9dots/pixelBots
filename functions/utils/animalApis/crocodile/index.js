'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speed = exports.gameImage = exports.imageURL = exports.docs = undefined;

var _actions = require('../actions');

var _getDirection = require('../../getDirection');

var _getDirection2 = _interopRequireDefault(_getDirection);

var _docs = require('./docs');

var _docs2 = _interopRequireDefault(_docs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageURL = '/animalImages/crocodile.png';
var gameImage = '/animalImages/crocodiletop.png';
var speed = 750;

function wrap(id) {
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
  var paint = function paint(lineNum, color) {
    return (0, _actions.animalPaint)(id, color, lineNum);
  };

  function moveCrocodile(steps, lineNum) {
    return (0, _actions.animalMove)(id, getNewLocation(steps), lineNum);
  }

  return {
    move: move,
    turnRight: turnRight,
    turnLeft: turnLeft,
    paint: paint
  };
}

function getPaintColor(state, id) {
  var painted = state.game.painted || {};
  var location = state.game.animals[id].current.location;
  return painted[location] !== 'black' ? 'black' : 'white';
}

function getNewLocation(steps) {
  return function (loc, rot) {
    var dir = (0, _getDirection2.default)(rot);

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
