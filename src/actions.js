import createAction from '@f/create-action'

const animalPaint = createAction('ANIMAL_PAINT', (id, color) => ({id, color}))
const animalMove = createAction('ANIMAL_MOVE', (id, location) => ({location, id}))
const setActive = createAction('SET_ANIMAL_ACTIVE', (id) => id)
const addCode = createAction('ADD_CODE', (id, fn) => ({id, fn}))
const reset = createAction('RESET')
const removeLine = createAction('REMOVE_LINE', (id, idx) => ({id, idx}))
const startRun = createAction('START_RUN')
const stopRun = createAction('STOP_RUN')
const moveError = createAction('MOVE_ERROR')
const setActiveLine = createAction('SET_ACTIVE_LINE', (idx) => idx)
const updateLine = createAction('UPDATE_LINE', (id, lineNum, code) => ({id, lineNum, code}))
const selectLine = createAction('SELECT_LINE', (id, idx) => ({id, idx}))
const clearError = createAction('CLEAR_ERROR')

export {
  setActiveLine,
  animalPaint,
  removeLine,
  animalMove,
  updateLine,
  selectLine,
  clearError,
  setActive,
  moveError,
  startRun,
  stopRun,
  addCode,
  reset
}
