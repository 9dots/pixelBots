/**
 * Imports
 */

import createAction from '@f/create-action'

/**
 * Actions
 */

const getCurrentColor = createAction('getCurrentColor', (...args) => args)
const animalPaint = createAction('animalPaint', (...args) => args)
const animalMove = createAction('animalMove', (...args) => args)
const animalTurn = createAction('animalTurn', (...args) => args)
const setLine = createAction('setActiveLine', (...args) => args)
const rand = createAction('createRand', (...args) => args)

/**
 * Functions
 */

function * checkColor (color, lineNum) {
  return (yield getCurrentColor(lineNum)) === color
}

function * ifColor (color, fn, lineNum) {
  if (yield checkColor(color, lineNum)) {
    yield fn()
  }
}

function * loopFn (max, fn, lineNum) {
  for (let i = 0; i < max; i++) {
    yield setLine(lineNum)
    yield * fn()
  }
}

/**
 * Exports
 */

export {
  animalPaint,
  animalMove,
  animalTurn,
  ifColor,
  loopFn,
  rand
}
