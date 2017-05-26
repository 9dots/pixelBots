"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getRotation(rot) {
  var circles = Math.floor(Math.abs(rot) / 360);
  if (rot < 0) {
    return rot + 360 * (circles + 1);
  } else {
    return rot - 360 * circles;
  }
}

exports.default = function (rot) {
  return getRotation(rot) / 90 % 4;
};
