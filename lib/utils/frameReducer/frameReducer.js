/**
 * Imports
 */

import sequenceToCode from 'pages/Game/utils/sequenceToCode'
import getIterator from 'pages/Game/utils/getIterator'
import flattenGen from '@f/flatten-gen'
import deepEqual from '@f/deep-equal'
import animalApis from 'animalApis'
import setProp from '@f/set-prop'

/**
 * Frame reducer
 */

function frameReducer (frame, action) {
  switch (action.type) {
    case 'animalPaint':
      return animalPaint(frame, ...action.payload)
    case 'animalMove': {
      const [id, getLocation] = action.payload
      return setAnimalPos(frame, id, computeLocation(frame, id, getLocation))
    }
    case 'animalTurn':
      return animalTurn(frame, ...action.payload)
  }
}

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
      state.animals[id].current.rot + turn
    )
  }
}

function createFrames (frame, id) {
  const it = flattenGen(createIterator(frame.animals[id], id))()
  var {value, done} = it.next()
  const frames = []

  while (!done) {
    frame = frameReducer(frame, value)
    frames.push(frame)
    var {value, done} = it.next()
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

function createIteratorQ (animal, id) {
  try {
    return Promise.resolve(createIterator(animal, id))
  } catch (err) {
    return Promise.reject(err)
  }
}

function createIterator (animal, id) {
  const api = animalApis[animal.type].default(id)
  const it = getIterator(sequenceToCode(animal.sequence), api)

  if (it.error) {
    throw {
      e: it.error,
      message: it.error.name,
      lineNum: it.error.loc && it.error.loc.line - 1
    }
  } else {
    return it
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

/**
 * Exports
 */

export default frameReducer
export {
  createFrames,
  setAnimalPos,
  animalPaint,
  animalTurn,
  updateAnimal,
  computeLocation,
  createIteratorQ,
  checkBounds,
  validate,
  isEqualSequence,
  filterPaints
}
