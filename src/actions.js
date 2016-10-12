import createAction from '@f/create-action'
import {bindUrl, setUrl} from 'redux-effects-location'
import {firebaseSet} from 'vdux-fire'

const animalMove = createAction(
  'ANIMAL_MOVE',
  (id, location) => ({location, id}),
  (id, location, lineNum) => ({lineNum})
)
const animalPaint = createAction(
  'ANIMAL_PAINT',
  (id, color) => ({id, color}),
  (id, location, lineNum) => ({lineNum})
)
const moveError = createAction(
  'MOVE_ERROR',
  (msg) => msg,
  (msg, lineNum) => ({lineNum})
)
const updateLine = createAction(
  'UPDATE_LINE',
  (id, lineNum, code) => ({id, lineNum, code})
)
const throwError = createAction(
  'THROW_ERROR',
  (message, lineNum) => ({message, lineNum})
)
const selectLine = createAction('SELECT_LINE', (id, idx) => ({id, idx}))
const removeLine = createAction('REMOVE_LINE', (id, idx) => ({id, idx}))
const setActiveLine = createAction('SET_ACTIVE_LINE', (idx) => idx)
const endRunMessage = createAction('END_RUN_MESSAGE')
const addCode = createAction('ADD_CODE', (id, fn) => ({id, fn}))
const setActive = createAction('SET_ANIMAL_ACTIVE', (id) => id)
const handleError = createAction('HANDLE_ERROR')
const moveAnimal = createAction('MOVE_ANIMAL', (opts) => opts, (opts, lineNum) => ({lineNum}))
const initializeGame = createAction('INITIALIZE_GAME')
const clearMessage = createAction('CLEAR_MESSAGE')
const setGameData = createAction('SET_GAME_DATA')
const gameLoaded = createAction('GAME_LOADED')
const aceUpdate = createAction('ACE_UPDATE')
const codeAdded = createAction('CODE_ADDED')
const swapMode = createAction('SWAP_MODE')
const startRun = createAction('START_RUN')
const newRoute = createAction('NEW_ROUTE')
const stopRun = createAction('STOP_RUN')
const endRun = createAction('END_RUN')
const reset = createAction('RESET')

function initializeApp () {
  return bindUrl(newRoute)
}

function * createNew () {
  const id = yield firebaseSet({method: 'push', ref: 'games', value: '1234'})
  yield setUrl(`/${id}/create/animal`)
}

export {
  initializeGame,
  setActiveLine,
  endRunMessage,
  initializeApp,
  clearMessage,
  setGameData,
  animalPaint,
  handleError,
  removeLine,
  throwError,
  animalMove,
  updateLine,
  gameLoaded,
  selectLine,
  moveAnimal,
  codeAdded,
  setActive,
  createNew,
  moveError,
  aceUpdate,
  swapMode,
  startRun,
  newRoute,
  stopRun,
  addCode,
  endRun,
  reset
}
