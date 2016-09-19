import createAction from '@f/create-action'

const updateLine = createAction('UPDATE_LINE', (id, lineNum, code) => ({id, lineNum, code}))
const throwError = createAction('THROW_ERROR', (message, lineNum) => ({message, lineNum}))
const animalMove = createAction('ANIMAL_MOVE', (id, location) => ({location, id}))
const animalPaint = createAction('ANIMAL_PAINT', (id, color) => ({id, color}))
const selectLine = createAction('SELECT_LINE', (id, idx) => ({id, idx}))
const removeLine = createAction('REMOVE_LINE', (id, idx) => ({id, idx}))
const setActiveLine = createAction('SET_ACTIVE_LINE', (idx) => idx)
const addCode = createAction('ADD_CODE', (id, fn) => ({id, fn}))
const setActive = createAction('SET_ANIMAL_ACTIVE', (id) => id)
const clearError = createAction('CLEAR_ERROR')
const aceUpdate = createAction('ACE_UPDATE')
const moveError = createAction('MOVE_ERROR')
const startRun = createAction('START_RUN')
const stopRun = createAction('STOP_RUN')
const reset = createAction('RESET')

export {
  setActiveLine,
  animalPaint,
  removeLine,
  throwError,
  animalMove,
  updateLine,
  selectLine,
  clearError,
  setActive,
  moveError,
  aceUpdate,
  startRun,
  stopRun,
  addCode,
  reset
}
