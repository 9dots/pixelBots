/**
 * Imports
 */

import createAction from '@f/create-action'

/**
 * Actions
 */

const animalMove = createAction('animalMove', (...args) => args)
const animalPaint = createAction('animalPaint', (...args) => args)
const animalTurn = createAction('animalTurn', (...args) => args)

/**
 * Exports
 */

export {
  animalMove,
  animalPaint,
  animalTurn
}
