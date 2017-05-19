'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speed = exports.imageURL = exports.docs = undefined;

var _actions = require('../actions');

var _animal = require('../../animal');

var _docs = require('./docs');

var _docs2 = _interopRequireDefault(_docs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageURL = '/animalImages/zebra.jpg';
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
    return (0, _actions.animalPaint)(id, 'black', lineNum);
  };

  function move(dir, steps, lineNum) {
    return (0, _actions.animalMove)(id, (0, _animal.getNewLocation)(dir, steps), lineNum);
  }

  return {
    up: up,
    right: right,
    down: down,
    left: left,
    paint: paint
  };
}

function getPaintColor(state, id) {
  var painted = state.game.painted || {};
  var location = state.game.animals[id].current.location;
  return painted[location] !== 'black' ? 'black' : 'white';
}

exports.default = wrap;
exports.docs = _docs2.default;
exports.imageURL = imageURL;
exports.speed = speed;