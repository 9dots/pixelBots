'use strict';

require('babel-polyfill')
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastFrame = exports.generatePainted = exports.createRand = exports.getCurrentColor = exports.filterPaints = exports.isEqualSequence = exports.validate = exports.getLastTeacherFrame = exports.checkBounds = exports.createIterator = exports.createIteratorQ = exports.computeLocation = exports.updateAnimal = exports.setAnimalPos = exports.getIterator = exports.createPaintFrames = exports.createFrames = exports.turn = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _sequenceToCode = require('../sequenceToCode');

var _sequenceToCode2 = _interopRequireDefault(_sequenceToCode);

var _getDirection = require('../getDirection');

var _getDirection2 = _interopRequireDefault(_getDirection);

var _autoYieldDelegate = require('auto-yield-delegate');

var _autoYieldDelegate2 = _interopRequireDefault(_autoYieldDelegate);

var _flattenGen = require('@f/flatten-gen');

var _flattenGen2 = _interopRequireDefault(_flattenGen);

var _deepEqual = require('@f/deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _animalApis = require('../animalApis');

var _animalApis2 = _interopRequireDefault(_animalApis);

var _identity = require('@f/identity');

var _identity2 = _interopRequireDefault(_identity);

var _setProp = require('@f/set-prop');

var _setProp2 = _interopRequireDefault(_setProp);

var _range = require('@f/range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Frame reducer
 */

function frameReducer(frame, type, args) {
  var fn = actions[type] || _identity2.default;
  return [].concat(fn.apply(undefined, [frame].concat((0, _toConsumableArray3.default)(args))));
} /**
   * Imports
   */

var actions = {
  right: function right(frame, id) {
    var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return addAnimalPos(frame, id, [0, steps]);
  },
  left: function left(frame, id) {
    var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return addAnimalPos(frame, id, [0, -steps]);
  },
  up: function up(frame, id) {
    var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return addAnimalPos(frame, id, [-steps, 0]);
  },
  down: function down(frame, id) {
    var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    return addAnimalPos(frame, id, [steps, 0]);
  },
  forward: forward,
  move: forward,
  turnRight: function turnRight(frame, id) {
    return turn(frame, id, 90);
  },
  turnLeft: function turnLeft(frame, id) {
    return turn(frame, id, -90);
  },
  paint: paint,
  paintL: paintL,
  paintJ: paintJ,
  paintT: paintT,
  paintO: paintO,
  paintI: paintI,
  paintS: paintS,
  paintZ: paintZ,
  moveTo: moveTo,
  rand: createRand,
  getCurrentColor: getCurrentColor
};

/**
 * Actions
 */

 function moveTo (state, id, x, y) {
   if (x === undefined || y === undefined) {
     throw {
       message: 'Unexpected number of parameters moveTo',
     }
     return state
   }
   return setAnimalPos(state, id, [state.levelSize[0] - y - 1, x])
 }

function forward(state, id) {
  var steps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var rot = state.animals[id].current.rot;

  return addAnimalPos(state, id, vmul(steps, getHeading(rot)));
}

function paint(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';

  return (0, _extends5.default)({}, state, {
    paints: (state.paints || 0) + 1,
    painted: (0, _extends5.default)({}, state.painted, (0, _defineProperty3.default)({}, state.animals[id].current.location, color))
  });
}

function paintZ(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur = state.animals[id].current,
      location = _state$animals$id$cur.location,
      rot = _state$animals$id$cur.rot;

  var heading = getHeading(rot);
  var startPoint2 = [rot, rot + 90].reduce(function (loc, rot) {
    var heading = getHeading(rot);
    return vadd(loc, heading);
  }, location);
  var paintLocations = [].concat((0, _toConsumableArray3.default)(paintLine(location, heading, 2)), (0, _toConsumableArray3.default)(paintLine(startPoint2, heading, 2)));
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintS(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur2 = state.animals[id].current,
      location = _state$animals$id$cur2.location,
      rot = _state$animals$id$cur2.rot;

  var heading = getHeading(rot);
  var startPoint2 = [rot, rot - 90].reduce(function (loc, rot) {
    var heading = getHeading(rot);
    return vadd(loc, heading);
  }, location);
  var paintLocations = [].concat((0, _toConsumableArray3.default)(paintLine(location, heading, 2)), (0, _toConsumableArray3.default)(paintLine(startPoint2, heading, 2)));
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintO(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur3 = state.animals[id].current,
      location = _state$animals$id$cur3.location,
      rot = _state$animals$id$cur3.rot;

  var heading = getHeading(rot);
  var paintLocations = [].concat((0, _toConsumableArray3.default)(paintLine(location, heading, 2)), (0, _toConsumableArray3.default)(paintLine(vadd(location, getHeading(rot + 90)), heading, 2)));
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintI(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur4 = state.animals[id].current,
      location = _state$animals$id$cur4.location,
      rot = _state$animals$id$cur4.rot;

  var heading = getHeading(rot);

  return paintMultipleLocations(state, id, color, paintLine(location, heading, 4));
}

function paintL(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur5 = state.animals[id].current,
      location = _state$animals$id$cur5.location,
      rot = _state$animals$id$cur5.rot;

  var heading = getHeading(rot);
  var paintLocations = [].concat((0, _toConsumableArray3.default)(paintLine(location, heading, 2)), (0, _toConsumableArray3.default)(paintLine(vadd(location, heading), getHeading(rot + 90), 3)));
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintJ(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur6 = state.animals[id].current,
      location = _state$animals$id$cur6.location,
      rot = _state$animals$id$cur6.rot;

  var heading = getHeading(rot);
  var paintLocations = [].concat((0, _toConsumableArray3.default)(paintLine(location, heading, 2)), (0, _toConsumableArray3.default)(paintLine(vadd(location, heading), getHeading(rot - 90), 3)));
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintT(state, id) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';
  var _state$animals$id$cur7 = state.animals[id].current,
      location = _state$animals$id$cur7.location,
      rot = _state$animals$id$cur7.rot;

  var heading = getHeading(rot);
  var paintLocations = [location, vadd(location, heading), vadd(location, heading.map(function (val) {
    return val === 0 ? val + 1 : val;
  })), vadd(location, heading.map(function (val) {
    return val === 0 ? val - 1 : val;
  }))];
  return paintMultipleLocations(state, id, color, paintLocations);
}

function paintLine(location, heading, length) {
  return (0, _range2.default)(length).map(function (i) {
    return vadd(location, vmul(i, heading));
  });
}

function paintMultipleLocations(state, id, color, locations) {
  return (0, _extends5.default)({}, state, {
    paints: (state.paints || 0) + 1,
    painted: (0, _extends5.default)({}, state.painted, locations.reduce(function (acc, loc) {
      return (0, _extends5.default)({}, acc, (0, _defineProperty3.default)({}, loc, color));
    }, {}))
  });
}

function addAnimalPos(state, id, vector) {
  var location = state.animals[id].current.location;

  return setAnimalPos(state, id, vadd(location, vector));
}

function setAnimalPos(state, id, location) {
  return (0, _extends5.default)({}, state, {
    animals: updateAnimal(state.animals, 'current.location', id, location)
  });
}

function turn(state, id, turn) {
  return (0, _extends5.default)({}, state, {
    animals: updateAnimal(state.animals, 'current.rot', id, state.animals[id].current.rot + turn)
  });
}

function createRand(frame, lineNum, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  return [frame, Math.floor(frame.rand(max, min))];
}

function getCurrentColor(state) {
  return [state, state.painted[state.animals[state.active].current.location] || 'white'];
}

/**
 * Helpers
 */

 function createPaintFrames(frame, code, seed) {
   return createFrames(frame, code, seed)
     .map((f, i) => Object.assign({}, f.painted, {step: i}))
     .reduce((acc, paint, key, painted) => {
       var prev = acc[acc.length - 1] ? painted[acc[acc.length - 1].step] : {};
       const newPaints = ((0, _keys2.default)(paint).filter(function (key) {
         return key !== 'step' && prev[key] !== paint[key];
       })).reduce((acc, next, i) => {
         return Object.assign({}, acc, {[next]: paint[next], step: key})
       }, {})
       return newPaints && Object.keys(newPaints).length > 0
         ? acc.concat(newPaints)
         : acc
     }, [])
 }

function createFrames(frame, code, seed) {
  var it = createIterator(code);
  var value;
  var frames = [];

  var _it$next = it.next(value),
      value = _it$next.value,
      done = _it$next.done;

  while (!done) {
    var type = value.type,
        _value$payload = value.payload,
        payload = _value$payload === undefined ? [] : _value$payload;

    var _frameReducer = frameReducer(frame, type, payload.slice(1)),
        _frameReducer2 = (0, _slicedToArray3.default)(_frameReducer, 2),
        frame = _frameReducer2[0],
        ret = _frameReducer2[1];

    frames.push(frame);

    var _it$next2 = it.next(ret),
        value = _it$next2.value,
        done = _it$next2.done;
  }

  return frames;
}

function updateAnimal() {
  var animals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var path = arguments[1];
  var id = arguments[2];
  var val = arguments[3];

  return animals.map(function (animal, i) {
    return i === id ? (0, _setProp2.default)(path, animal, val) : animal;
  });
}

function computeLocation(frame, id, location) {
  return Array.isArray(location) ? location : location(frame.animals[id].current.location, frame.animals[id].current.rot);
}

function checkBounds(location, level) {
  for (var coord in location) {
    if (location[coord] >= level[coord] || location[coord] < 0) {
      return false;
    }
  }

  return true;
}

function createIteratorQ(code) {
  try {
    return _promise2.default.resolve(createIterator(code));
  } catch (err) {
    return _promise2.default.reject(err);
  }
}

function createIterator(code) {
  var it = code();

  if (it.error) {
    throw {
      e: it.error,
      message: it.error.name,
      lineNum: it.error.loc && it.error.loc.line - 1
    };
  } else {
    return (0, _flattenGen2.default)(it)();
  }
}

function validate(frames, idx, location, color) {
  var next = frames[idx] || {};
  var prev = frames[idx - 1] || {};
  var changedLoc = (0, _keys2.default)(next).filter(function (key) {
    return prev[key] !== next[key];
  })[0];

  if (location.toString() !== changedLoc) {
    return 'location';
  }

  if (next[changedLoc] !== color) {
    return 'color';
  }

  return null;
}

function filterPaints(frames) {
  return frames.filter(function (f) {
    return f.painted && (0, _keys2.default)(f.painted).length > 0;
  }).reduce(function (acc, f) {
    return !acc.length || !(0, _deepEqual2.default)(f.painted, acc[acc.length - 1].painted) ? acc.concat(f) : acc;
  }, []);
}

function filterWhite(frame) {
  if (!frame) return {};
  return (0, _extends5.default)({}, frame, {
    painted: filter(function (square) {
      return square !== 'white';
    }, frame.painted || {})
  });
}

function validateFrame(a, b) {
  return (0, _deepEqual2.default)(filterWhite(a), filterWhite(b));
}

function getSequences(animals) {
  return animals.map(function (a) {
    return a.sequence;
  });
}

function isEqualSequence() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return (0, _deepEqual2.default)(getSequences(a), getSequences(b));
}

function getLastFrame(state, code) {
  var frames = createFrames((0, _assign2.default)({}, state, {
    animals: state.animals.map(function (a) {
      return (0, _assign2.default)({}, a, { current: a.initial });
    })
  }), code);
  var lastFrame = frames[frames.length - 1];
  return frames && lastFrame ? lastFrame.painted : {};
}

function getLastTeacherFrame(state, code) {
  return getLastFrame((0, _extends5.default)({}, state, {
    animals: [{
      initial: {
        rot: 0,
        location: [state.levelSize[0] - 1, 0]
      },
      type: 'teacherBot'
    }]
  }), code);
}

function generatePainted(state, code) {
  var initialPainted = state.initialPainted,
      active = state.active;


  return (typeof initialPainted === 'undefined' ? 'undefined' : (0, _typeof3.default)(initialPainted)) === 'object' ? initialPainted : getLastFrame(state, code === undefined ? getIterator(initialPainted, _animalApis2.default['teacherBot'].default(active)) : code);
}

function wrap(code, api) {
  return '\n  (() => {\n    var {' + (0, _keys2.default)(api).join(', ') + '} = api\n    function * codeRunner () {\n      try {\n        ' + code + '\n      } catch (e) {\n        yield {\n          type: \'throwError\',\n          payload: [e]\n        }\n      }\n    }\n    return codeRunner\n  })()\n';
}

function getIterator(code, api) {
  var newCode = (0, _sequenceToCode2.default)(code);
  // const autoYielded = autoYield(newCode, api)
  // const wrapped = wrap(autoYielded, api)
  // const evaled = eval(wrapped)

  return function () {
    return eval(wrap((0, _autoYieldDelegate2.default)(newCode, api), api))();
  };
}

function getHeading(rot) {
  var radians = rot * (Math.PI / 180);

  return [-1 * Math.round(Math.cos(radians)), Math.round(Math.sin(radians))];
}

function vadd(x, y) {
  if (x.length !== y.length) throw new Error('Cannot add vectors of different lengths');
  return x.map(function (a, i) {
    return a + y[i];
  });
}

function vmul(a, x) {
  return x.map(function (b) {
    return b * a;
  });
}

/**
 * Exports
 */

exports.default = frameReducer;
exports.turn = turn;
exports.createFrames = createFrames;
exports.createPaintFrames = createPaintFrames;
exports.getIterator = getIterator;
exports.setAnimalPos = setAnimalPos;
exports.updateAnimal = updateAnimal;
exports.computeLocation = computeLocation;
exports.createIteratorQ = createIteratorQ;
exports.createIterator = createIterator;
exports.checkBounds = checkBounds;
exports.getLastTeacherFrame = getLastTeacherFrame;
exports.validate = validate;
exports.isEqualSequence = isEqualSequence;
exports.filterPaints = filterPaints;
exports.getCurrentColor = getCurrentColor;
exports.createRand = createRand;
exports.generatePainted = generatePainted;
exports.getLastFrame = getLastFrame;
