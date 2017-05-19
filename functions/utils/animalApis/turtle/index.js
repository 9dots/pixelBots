'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docs = undefined;

var _actions = require('../actions');

var _animal = require('../../animal');

var docs = {
  up: {
    usage: 'up()',
    description: 'Move the zebra up one space.'
  },
  left: {
    usage: 'left()',
    description: 'Move the zebra left one space.'
  },
  right: {
    usage: 'right()',
    description: 'Move the zebra right one space.'
  },
  down: {
    usage: 'down()',
    description: 'Move the zebra down one space.'
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the zebra is currently on color.',
    args: 'color'
  }
};

function wrap(id) {
  var up = function up(steps, lineNum) {
    return move(0, steps, lineNum);
  };
  var right = function right(steps, lineNum) {
    return move(1, steps, lineNum);
  };
  var down = function down(steps, lineNum) {
    return move(2, steps, lineNum);
  };
  var left = function left(steps, lineNum) {
    return move(3, steps, lineNum);
  };
  var paint = function paint(lineNum, color) {
    return (0, _actions.animalPaint)(id, color, lineNum);
  };
  var speed = 750;

  function move(dir, steps, lineNum) {
    var state = getState();
    var animal = state.animals[id];
    var location = (0, _animal.getNewLocation)(animal.current.location, dir);

    if (checkBounds(location, state.levelSize)) {
      return (0, _actions.animalMove)(id, location, lineNum);
    } else {
      return moveError('Out of bounds', lineNum);
    }
  }

  return {
    up: up,
    right: right,
    down: down,
    left: left,
    paint: paint,
    speed: speed,
    docs: docs
  };
}

exports.default = wrap;
exports.docs = docs;