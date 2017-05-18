/**
 * Imports
 */

import sequenceToCode from 'pages/Game/utils/sequenceToCode'
import autoYield from 'auto-yield-delegate'
import flattenGen from '@f/flatten-gen'
import deepEqual from '@f/deep-equal'
import animalApis from 'animalApis'
import setProp from '@f/set-prop'
import srand from '@f/srand'

/**
 * Frame reducer
 */

function frameReducer (frame, action) {
  switch (action.type) {
    case 'animalPaint':
      return [animalPaint(frame, ...action.payload)]
    case 'animalMove': {
      const [id, getLocation] = action.payload
      return [setAnimalPos(frame, id, computeLocation(frame, id, getLocation))]
    }
    case 'animalTurn':
      return [animalTurn(frame, ...action.payload)]
    case 'getCurrentColor':
      return [frame, getCurrentColor(frame)]
    case 'createRand':
      return [frame, createRand(frame.randSeed, ...action.payload)]
    default:
      return [frame]
  }
}

/**
 * Actions
 */

function animalPaint (state, id, color) {
  return {
    ...state,
    paints: (state.paints || 0) + 1,
    painted: {
      ...state.painted,
      [state.animals[id].current.location]: color
    }
  }
}

function setAnimalPos (state, id, location) {
  return {
    ...state,
    animals: updateAnimal(state.animals, 'current.location', id, location)
  }
}

function animalTurn (state, id, turn) {
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

function createRand (seed = Math.random() * 1000, lineNum, min, max) {
  if (max === undefined) {
    max = min
    min = 0
  }

  return Math.floor(srand(seed)(min, max))
}

function getCurrentColor (state) {
  return state.painted[state.animals[state.active].current.location] || 'white'
}

/**
 * Helpers
 */

function createFrames (frame, code, seed) {
  const it = createIterator(code)
  var value
  const frames = []
  var {value, done} = it.next(value)

  while (!done) {
    var [frame, ret] = frameReducer(frame, value)
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

function isEqualSequence (a, b) {
  return deepEqual(getSequences(a), getSequences(b))
}

function getLastFrame (state, code, randSeed) {
  const frames = createFrames({
    ...state,
    animals: [{
      current: {
        rot: 0,
        location: [state.levelSize[0] - 1, 0]
      },
      type: 'teacherBot'
    }]
  }, code, randSeed)
  const lastFrame = frames[frames.length - 1]
  return frames && lastFrame ? lastFrame.painted : {}
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
          payload: e
        }
      }
    }
    return codeRunner
  })()
`
}

function getIterator (code, api) {
  api = typeof api === 'string'
    ? animalApis[api].default(0)
    : api
  const newCode = sequenceToCode(code)
  const autoYielded = autoYield(newCode, api)
  const wrapped = wrap(autoYielded, api)

  const evaled = eval(wrapped)

  return () => {
    try {
      return evaled()
    } catch (err) {
      return {error: err}
    }
  }
}

/**
 * Exports
 */

 export {
   createFrames,
   getIterator,
   setAnimalPos,
   animalPaint,
   animalTurn,
   updateAnimal,
   computeLocation,
   createIteratorQ,
   createIterator,
   checkBounds,
   validate,
   isEqualSequence,
   filterPaints,
   getCurrentColor,
   createRand,
   generatePainted,
   getLastFrame
 }
export default frameReducer
