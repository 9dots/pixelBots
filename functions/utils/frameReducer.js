require('babel-polyfill')

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastFrame = exports.generatePainted = exports.createRand = exports.getCurrentColor = exports.filterPaints = exports.isEqualSequence = exports.validate = exports.checkBounds = exports.createIteratorQ = exports.computeLocation = exports.updateAnimal = exports.animalTurn = exports.animalPaint = exports.setAnimalPos = exports.createFrames = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator = require('./getIterator');

var _getIterator2 = _interopRequireDefault(_getIterator);

var _flattenGen = require('@f/flatten-gen');

var _flattenGen2 = _interopRequireDefault(_flattenGen);

var _deepEqual = require('@f/deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _animalApis = require('./animalApis');

var _animalApis2 = _interopRequireDefault(_animalApis);

var _setProp = require('@f/set-prop');

var _setProp2 = _interopRequireDefault(_setProp);

var srand = require('@f/srand')

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Frame reducer
 */

function frameReducer(frame, action) {
  switch (action.type) {
    case 'animalPaint':
      return [animalPaint.apply(undefined, [frame].concat((0, _toConsumableArray3.default)(action.payload)))];
    case 'animalMove':
      {
        var _action$payload = (0, _slicedToArray3.default)(action.payload, 2),
            id = _action$payload[0],
            getLocation = _action$payload[1];
        console.log(id, getLocation)
        return [setAnimalPos(frame, id, computeLocation(frame, id, getLocation))];
      }
    case 'animalTurn':
      return [animalTurn.apply(undefined, [frame].concat((0, _toConsumableArray3.default)(action.payload)))];
    case 'getCurrentColor':
      return [frame, getCurrentColor(frame)];
    case 'createRand':
      return [frame, createRand.apply(undefined, [frame.rand, (0, _toConsumableArray3.default)(action.payload)])];
    default:
      return [frame];
  }
}

/**
 * Actions
 */

/**
 * Imports
 */

function animalPaint(state, id, color) {
  return (0, _extends4.default)({}, state, {
    paints: (state.paints || 0) + 1,
    painted: (0, _extends4.default)({}, state.painted, (0, _defineProperty3.default)({}, state.animals[id].current.location, color))
  });
}

function setAnimalPos(state, id, location) {
  return (0, _extends4.default)({}, state, {
    animals: updateAnimal(state.animals, 'current.location', id, location)
  });
}

function animalTurn(state, id, turn) {
  return (0, _extends4.default)({}, state, {
    animals: updateAnimal(state.animals, 'current.rot', id, state.animals[id].current.rot + turn)
  });
}

function createRand (rand, [lineNum, min, max]) {
  if (max === undefined) {
    max = min
    min = 0
  }
  return Math.floor(rand(max, min))
}

function getCurrentColor(state) {
  return (state.painted || {})[state.animals[state.active].current.location] || 'white';
}

/**
 * Helpers
 */

function createPaintFrames(frame, code) {
  var it = createIterator(code);
  var value;
  var frames = [];
  var step = 0

  var _it$next = it.next(value),
      value = _it$next.value,
      done = _it$next.done;

  while (!done) {
    step++
    var _frameReducer = frameReducer(frame, value),
        _frameReducer2 = (0, _slicedToArray3.default)(_frameReducer, 2),
        frame = _frameReducer2[0],
        ret = _frameReducer2[1];

    if (value.type === 'animalPaint') {
      frames.push({[frame.animals[0].current.location]: value.payload[1], frame: step});
    }

    var _it$next2 = it.next(ret),
        value = _it$next2.value,
        done = _it$next2.done;
  }

  return frames;
}

function createFrames(frame, code) {
  var it = createIterator(code);
  var value;
  var frames = [];

  var _it$next = it.next(value),
      value = _it$next.value,
      done = _it$next.done;

  while (!done) {
    var _frameReducer = frameReducer(frame, value),
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

function updateAnimal(animals, path, id, val) {
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
  var next = frames[idx];
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
  return (0, _extends4.default)({}, frame, {
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

function isEqualSequence(a, b) {
  return (0, _deepEqual2.default)(getSequences(a), getSequences(b));
}

function getLastFrame (state, code) {
  const frames = createFrames(Object.assign({}, state, {
    animals: state.animals.map(a => Object.assign({}, a, {current: a.initial}))
  }), code)
  return frames ? frames[frames.length - 1].painted : {}
}

function getLastTeacherFrame(state, code) {
  return geLastFrame((0, _extends4.default)({}, state, {
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
      animals = state.animals,
      active = state.active;


  return (typeof initialPainted === 'undefined' ? 'undefined' : (0, _typeof3.default)(initialPainted)) === 'object' ? initialPainted : getLastFrame(state, code === undefined ? (0, _getIterator2.default)(initialPainted, _animalApis2.default['teacherBot'].default(active)) : code);
}

/**
 * Exports
 */

exports.default = frameReducer;
exports.createPaintFrames = createPaintFrames;
exports.createFrames = createFrames;
exports.setAnimalPos = setAnimalPos;
exports.animalPaint = animalPaint;
exports.animalTurn = animalTurn;
exports.updateAnimal = updateAnimal;
exports.computeLocation = computeLocation;
exports.createIteratorQ = createIteratorQ;
exports.checkBounds = checkBounds;
exports.validate = validate;
exports.isEqualSequence = isEqualSequence;
exports.filterPaints = filterPaints;
exports.getCurrentColor = getCurrentColor;
exports.createRand = createRand;
exports.generatePainted = generatePainted;
exports.getLastFrame = getLastFrame;
