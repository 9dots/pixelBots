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
import range from '@f/range'

/**
 * Frame reducer
 */

function frameReducer (frame, type, args) {
  const fn = actions[type] || identity
  return [].concat(fn(frame, ...args))
}

const actions = {
  right,
  left,
  up,
  down,
  forward,
  move: forward,
  turnRight: (frame, id) => turn(frame, id, 90),
  turnLeft: (frame, id) => turn(frame, id, -90),
  faceNorth: (frame, id) => setAnimalRot(frame, id, 0),
  paint,
  toggle,
  paintL,
  paintJ,
  paintT,
  paintO,
  paintI,
  paintS,
  paintZ,
  moveTo,
  addLoop,
  removeLoop,
  rand: createRand,
  getCurrentColor,
  getLoopState
}

/**
 * Actions
 */

const right = (frame, id, steps = 1) => addAnimalPos(frame, id, [0, steps])
const left = (frame, id, steps = 1) => addAnimalPos(frame, id, [0, -steps])
const up = (frame, id, steps = 1) => addAnimalPos(frame, id, [-steps, 0])
const down = (frame, id, steps = 1) => addAnimalPos(frame, id, [steps, 0])


function getLoopState (state, id) {
  return [
    state,
    state.loops[id]
  ]
}

function addLoop (state, id) {
  return {
    ...state,
    loops: {
      ...state.loops,
      [id]: (state.loops[id] || []).concat(true)
    }
  }
}

function removeLoop (state, id) {
  return {
    ...state,
    loops: {
      ...state.loops,
      [id]: state.loops[id].slice(0, -1)
    }
  }
}

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

function toggle (state, id) {
  const location = state.animals[id].current.location
  const currentColor = state.painted[location]
  if (currentColor !== 'blue' && currentColor !== 'yellow') {
    return state
  }
  return {
    ...state,
    painted: {
      ...state.painted,
      [location]: currentColor === 'blue' ? 'yellow' : 'blue'
    }
  }
}

function paintZ (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const startPoint2 = [rot, rot + 90].reduce((loc, rot) => {
    const heading = getHeading(rot)
    return vadd(loc, heading)
  }, location)
  const paintLocations = [
    ...paintLine(location, heading, 2),
    ...paintLine(startPoint2, heading, 2)
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintS (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const startPoint2 = [rot, rot - 90].reduce((loc, rot) => {
    const heading = getHeading(rot)
    return vadd(loc, heading)
  }, location)
  const paintLocations = [
    ...paintLine(location, heading, 2),
    ...paintLine(startPoint2, heading, 2)
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintO (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const paintLocations = [
    ...paintLine(location, heading, 2),
    ...paintLine(vadd(location, getHeading(rot + 90)), heading, 2)
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintI (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)

  return paintMultipleLocations(state, id, color, paintLine(location, heading, 4))
}

function paintL (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const paintLocations = [
    ...paintLine(location, heading, 2),
    ...paintLine(vadd(location, heading), getHeading(rot + 90), 3)
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintJ (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const paintLocations = [
    ...paintLine(location, heading, 2),
    ...paintLine(vadd(location, heading), getHeading(rot - 90), 3)
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintT (state, id, color = 'black') {
  const {location, rot} = state.animals[id].current
  const heading = getHeading(rot)
  const paintLocations = [
    location,
    vadd(location, heading),
    vadd(location, heading.map(val => val === 0 ? val + 1 : val)),
    vadd(location, heading.map(val => val === 0 ? val - 1 : val)),
  ]
  return paintMultipleLocations(state, id, color, paintLocations)
}

function paintLine (location, heading, length) {
  return range(length).map((i) => vadd(location, vmul(i, heading)))
}

function paintMultipleLocations (state, id, color, locations) {
  const levelSize = state.levelSize || 5
  return {
    ...state,
    paints: (state.paints || 0) + 1,
    painted: {
      ...state.painted,
      ...locations
        .filter(loc => checkBounds(loc, levelSize))
        .reduce((acc, loc) => ({...acc, [loc]: color}), {})
    }
  }
}

function addAnimalPos (state, id, vector) {
  const {location} = state.animals[id].current
  return setAnimalPos(state, id, vadd(location, vector))
}

function moveTo (state, id, x, y) {
  if (x === undefined || y === undefined) {
    throw {
      message: 'Unexpected number of parameters moveTo',
    }
    return state
  }
  return setAnimalPos(state, id, [state.levelSize[0] - y - 1, x])
}

function setAnimalPos (state, id, location) {
  return {
    ...state,
    animals: updateAnimal(state.animals, 'current.location', id, location)
  }
}

function setAnimalRot (state, id, rot) {
  return {
    ...state,
    animals: updateAnimal(
      state.animals,
      'current.rot',
      id,
      rot
    )
  }
}

function turn (state, id, turn) {
  return setAnimalRot(state, id, state.animals[id].current.rot + turn)
}

function createRand (frame, lineNum, min, max) {
  if (max === undefined) {
    max = min
    min = 0
  }

  return [frame, Math.floor(frame.rand(max, min))]
}

function getCurrentColor (state) {
  const active = state.active || 0
  const painted = state.painted || {}

  return [
    state,
    painted[state.animals[active].current.location] || 'white'
  ]
}

/**
 * Helpers
 */

function createPaintFrames (frame, code, seed) {
  return filterPaints(createFrames(frame, code, seed))
    .map(f => f.painted)
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

function updateAnimal (animals = [], path, id, val) {
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

function getChangedLocations (frames, idx) {
  const next = frames[idx] || {}
  const prev = frames[idx - 1] || {}
  return Object.keys(next).filter(key => prev[key] !== next[key])
}

function validate (changedLoc, location = [], color, painted) {
  if (!changedLoc.some(loc => loc === location.join(','))) {
    return 'location'
  }

  if (painted[location] !== color) {
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

const prepend = ['switch', 'if', 'else if', 'for', 'while']

function getIterator (code, api) {
  const newCode = sequenceToCode(code)
  const regex = new RegExp('\\s*\\b(' + prepend.join('|') + ')\\b', 'g')
  const autoYielded = autoYield(newCode, api, null, 'callFn').split('\n').map((line, i) => {
    if (line.search(regex) > -1) {
      return `yield setLine(${(i + 1)}); ${line}`
    }
    return line
  }).join('\n')
  // const wrapped = wrap(autoYielded, api)
  // const evaled = eval(wrapped)
  return () => eval(wrap(autoYielded, api))()
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
  getChangedLocations,
  getLastTeacherFrame,
  createPaintFrames,
  computeLocation,
  createIteratorQ,
  isEqualSequence,
  getCurrentColor,
  generatePainted,
  createIterator,
  createFrames,
  setAnimalPos,
  updateAnimal,
  filterPaints,
  getLastFrame,
  getIterator,
  checkBounds,
  createRand,
  removeLoop,
  validate,
  addLoop,
  right,
  down,
  left,
  turn,
  up
}
