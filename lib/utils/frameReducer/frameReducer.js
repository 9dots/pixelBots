/**
 * Imports
 */

import sequenceToCode from 'pages/Game/utils/sequenceToCode'
import getDirection from 'pages/Game/utils/getDirection'
import autoYield from 'auto-yield-delegate'
import flattenGen from '@f/flatten-gen'
import deepEqual from '@f/deep-equal'
import animalApis from 'animalApis'
import identity from '@f/identity'
import setProp from '@f/set-prop'

/**
 * Frame reducer
 */

function frameReducer (frame, type, args) {
  const fn = actions[type] || identity
  return [].concat(fn(frame, ...args))
}

const actions = {
  right: (frame, id, steps = 1) => addAnimalPos(frame, id, [0, steps]),
  left: (frame, id, steps = 1) => addAnimalPos(frame, id, [0, -steps]),
  up: (frame, id, steps = 1) => addAnimalPos(frame, id, [-steps, 0]),
  down: (frame, id, steps = 1) => addAnimalPos(frame, id, [steps, 0]),
  forward,
  move: forward,
  turnRight: (frame, id) => turn(frame, id, 90),
  turnLeft: (frame, id) => turn(frame, id, -90),
  paint: (...args) => paint(...args),
  rand: createRand,
  getCurrentColor
}

/**
 * Actions
 */

function forward (state, id, steps = 1) {
  const {rot} = state.animals[id].current
  return addAnimalPos(state, id, vmul(steps, getHeading(rot)))
}

function paint (state, id, color = 'black') {
  return {
    ...state,
    paints: (state.paints || 0) + 1,
    painted: {
      ...state.painted,
      [state.animals[id].current.location]: color
    }
  }
}

function addAnimalPos (state, id, vector) {
  const {location} = state.animals[id].current
  return setAnimalPos(state, id, vadd(location, vector))
}

function setAnimalPos (state, id, location) {
  return {
    ...state,
    animals: updateAnimal(state.animals, 'current.location', id, location)
  }
}

function turn (state, id, turn) {
  return {
    ...state,
    animals: updateAnimal(
      state.animals,
      'current.rot',
      id,
      state.animals[id].current.rot + turn
    )
  }
}

function createRand (frame, lineNum, min, max) {
  if (max === undefined) {
    max = min
    min = 0
  }

  return [frame, Math.floor(frame.rand(max, min))]
}

function getCurrentColor (state) {
  return [
    state,
    state.painted[state.animals[state.active].current.location] || 'white'
  ]
}

/**
 * Helpers
 */

 function createPaintFrames (frame, code, seed) {
  return filterPaints(createFrames(frame, code, seed)).map(f => f.painted)
 }

function createFrames (frame, code, seed) {
  const it = createIterator(code)
  var value
  const frames = []

  var {value, done} = it.next(value)

  while (!done) {
    const {type, payload = []} = value
    var [frame, ret] = frameReducer(frame, type, payload.slice(1))
    frames.push(frame)
    var {value, done} = it.next(ret)
  }

  return frames
}

function updateAnimal (animals, path, id, val) {
  return animals.map((animal, i) => {
      return i === id
        ? setProp(path, animal, val)
        : animal
    })
}

function computeLocation (frame, id, location) {
  return Array.isArray(location)
    ? location
    : location(frame.animals[id].current.location, frame.animals[id].current.rot)
}

function checkBounds (location, level) {
  for (let coord in location) {
    if (location[coord] >= level[coord] || location[coord] < 0) {
      return false
    }
  }

  return true
}

function createIteratorQ (code) {
  try {
    return Promise.resolve(createIterator(code))
  } catch (err) {
    return Promise.reject(err)
  }
}

function createIterator (code) {
  const it = code()

  if (it.error) {
    throw {
      e: it.error,
      message: it.error.name,
      lineNum: it.error.loc && it.error.loc.line - 1
    }
  } else {
    return flattenGen(it)()
  }
}

function validate (frames, idx, location, color) {
  const next = frames[idx]
  const prev = frames[idx - 1] || {}
  const changedLoc = Object.keys(next).filter(key => prev[key] !== next[key])[0]

  if (location.toString() !== changedLoc) {
    return 'location'
  }

  if (next[changedLoc] !== color) {
    return 'color'
  }

  return null
}

function filterPaints (frames) {
  return frames
    .filter(f => f.painted && Object.keys(f.painted).length > 0)
    .reduce((acc, f) =>
      !acc.length || !deepEqual(f.painted, acc[acc.length - 1].painted)
        ? acc.concat(f)
        : acc
    , [])
}

function filterWhite (frame) {
  if (!frame) return {}
  return {
    ...frame,
    painted: filter(square => square !== 'white', frame.painted || {})
  }
}

function validateFrame (a, b) {
  return deepEqual(filterWhite(a), filterWhite(b))
}

function getSequences (animals) {
  return animals.map(a => a.sequence)
}

function isEqualSequence (a = [], b = []) {
  return deepEqual(getSequences(a), getSequences(b))
}

function getLastFrame (state, code) {
  const frames = createFrames(Object.assign({}, state, {
    animals: state.animals.map(a => Object.assign({}, a, {current: a.initial}))
  }), code)
  const lastFrame = frames[frames.length - 1]
  return frames && lastFrame ? lastFrame.painted : {}
}

function getLastTeacherFrame (state, code) {
  return getLastFrame({
    ...state,
    animals: [{
      initial: {
        rot: 0,
        location: [state.levelSize[0] - 1, 0]
      },
      type: 'teacherBot'
    }]
  }, code)
}

function generatePainted (state, code) {
  const {initialPainted, active} = state

  return typeof initialPainted === 'object'
    ? initialPainted
    : getLastFrame(state, code === undefined
      ? getIterator(initialPainted, animalApis['teacherBot'].default(active))
      : code)
}

function wrap (code, api) {
  return `
  (() => {
    var {${Object.keys(api).join(', ')}} = api
    function * codeRunner () {
      try {
        ${code}
      } catch (e) {
        yield {
          type: 'throwError',
          payload: [e]
        }
      }
    }
    return codeRunner
  })()
`
}

function getIterator (code, api) {
  const newCode = sequenceToCode(code)
  // const autoYielded = autoYield(newCode, api)
  // const wrapped = wrap(autoYielded, api)
  // const evaled = eval(wrapped)

  return () => eval(wrap(autoYield(newCode, api), api))()
}

function getHeading (rot) {
  const radians = rot * (Math.PI / 180)

  return [
    -1 * Math.round(Math.cos(radians)),
    Math.round(Math.sin(radians))
  ]
}

function vadd (x, y) {
  if (x.length !== y.length) throw new Error('Cannot add vectors of different lengths')
  return x.map((a, i) => a + y[i])
}

function vmul (a, x) {
  return x.map(b => b * a)
}

/**
 * Exports
 */

export default frameReducer
export {
  turn,
  createFrames,
  createPaintFrames,
  getIterator,
  setAnimalPos,
  updateAnimal,
  computeLocation,
  createIteratorQ,
  createIterator,
  checkBounds,
  getLastTeacherFrame,
  validate,
  isEqualSequence,
  filterPaints,
  getCurrentColor,
  createRand,
  generatePainted,
  getLastFrame
}
