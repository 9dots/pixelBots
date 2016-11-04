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
const moveAnimal = createAction(
  'MOVE_ANIMAL',
  (opts) => opts,
  (opts, lineNum) => ({lineNum})
)
const paintSquare = createAction('PAINT_SQUARE', (opts) => opts, (opts, lineNum) => ({lineNum}))
const selectLine = createAction('SELECT_LINE', (id, idx) => ({id, idx}))
const removeLine = createAction('REMOVE_LINE', (id, idx, type) => ({id, idx, type}))
const setActiveLine = createAction('SET_ACTIVE_LINE', (idx) => idx)
const addCode = createAction('ADD_CODE', (id, fn, idx) => ({id, fn, idx}))
const setActive = createAction('SET_ANIMAL_ACTIVE', (id) => id)
const initializeGame = createAction('INITIALIZE_GAME')
const endRunMessage = createAction('END_RUN_MESSAGE')
const setAnimalPos = createAction('SET_ANIMAL_POS')
const clearMessage = createAction('CLEAR_MESSAGE')
const setGameData = createAction('SET_GAME_DATA')
const handleError = createAction('HANDLE_ERROR')
const gameLoaded = createAction('GAME_LOADED')
const updateSize = createAction('UPDATE_SIZE')
const aceUpdate = createAction('ACE_UPDATE')
const setAnimal = createAction('SET_ANIMAL')
const codeAdded = createAction('CODE_ADDED')
const swapMode = createAction('SWAP_MODE')
const startRun = createAction('START_RUN')
const newRoute = createAction('NEW_ROUTE')
const stopRun = createAction('STOP_RUN')
const refresh = createAction('refresh')
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
  setAnimalPos,
  setGameData,
  animalPaint,
  paintSquare,
  handleError,
  removeLine,
  throwError,
  animalMove,
  updateLine,
  gameLoaded,
  updateSize,
  selectLine,
  moveAnimal,
  codeAdded,
  setActive,
  setAnimal,
  createNew,
  moveError,
  aceUpdate,
  swapMode,
  startRun,
  newRoute,
  stopRun,
  addCode,
  refresh,
  endRun,
  reset
}
