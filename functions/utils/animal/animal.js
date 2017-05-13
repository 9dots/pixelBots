'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterval = exports.getNewLocation = undefined;

var _animalApis = require('../animalApis');

var _animalApis2 = _interopRequireDefault(_animalApis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Animal utils
 */

function getNewLocation(dir, steps) {
  switch (dir) {
    case 0:
      return function (loc) {
        return [loc[0] - steps, loc[1]];
      };
    case 1:
      return function (loc) {
        return [loc[0], loc[1] + steps];
      };
    case 2:
      return function (loc) {
        return [loc[0] + steps, loc[1]];
      };
    case 3:
      return function (loc) {
        return [loc[0], loc[1] - steps];
      };
  }
}


function getRotation (rot) {
  const circles = Math.floor(Math.abs(rot) / 360)
  if (rot < 0) {
    return rot + (360 * (circles + 1))
  } else {
    return rot - (360 * circles)
  }
}

function getDirection (rot) {
  return (getRotation(rot) / 90) % 4
}

function getInterval(animal, speed) {
  return getTimeout(animal.type) * 1 / speed;
}

var getTimeout = function getTimeout(type) {
  return _animalApis2.default[type].speed + 50;
};

/**
 * Exports
 */

exports.getDirection = getDirection;
exports.getNewLocation = getNewLocation;
exports.getInterval = getInterval;