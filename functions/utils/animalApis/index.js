'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _turtle = require('./turtle');

var turtle = _interopRequireWildcard(_turtle);

var _zebra = require('./zebra');

var zebra = _interopRequireWildcard(_zebra);

var _panda = require('./panda');

var panda = _interopRequireWildcard(_panda);

var _toucan = require('./toucan');

var toucan = _interopRequireWildcard(_toucan);

var _crocodile = require('./crocodile');

var crocodile = _interopRequireWildcard(_crocodile);

var _chameleon = require('./chameleon');

var chameleon = _interopRequireWildcard(_chameleon);

var _penguin = require('./penguin');

var penguin = _interopRequireWildcard(_penguin);

var _teacherBot = require('./teacherBot');

var teacherBot = _interopRequireWildcard(_teacherBot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  turtle: turtle,
  zebra: zebra,
  panda: panda,
  chameleon: chameleon,
  toucan: toucan,
  crocodile: crocodile,
  penguin: penguin,
  teacherBot: teacherBot
};