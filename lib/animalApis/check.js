/**
 * Imports
 */

import createAction from '@f/create-action'

/**
 * Actions
 */

const getCurrentColor = createAction('getCurrentColor', (fn, lineNum) => [fn, lineNum])

/**
 * Functions
 */

function * checkColor (color, lineNum) {
  let currentColor
  yield getCurrentColor((color = 'white') => currentColor = color, lineNum)
  return (currentColor === color)
}

function * ifColor (color, fn, lineNum) {
  let currentColor
  yield getCurrentColor((color = 'white') => currentColor = color, lineNum)

  if (currentColor === color) {
    yield fn()
  }
}

/**
 * Exports
 */

export {
  checkColor,
  ifColor
}
