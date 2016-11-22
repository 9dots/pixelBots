import createAction from '@f/create-action'
import {bindUrl, setUrl} from 'redux-effects-location'
import {refMethod} from 'vdux-fire'
import {createCode} from './utils'
import sleep from '@f/sleep'

const animalMove = createAction(
  'ANIMAL_MOVE',
  (id, location) => ({location, id}),
  (id, location, lineNum) => ({lineNum})
)
const animalTurn = createAction(
  'ANIMAL_TURN',
  (id, rot) => ({id, rot}),
  (id, rot, lineNum) => ({lineNum})
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
const turnAnimal = createAction(
  'TURN_ANIMAL',
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
const setSaveId = createAction('SET_SAVE_ID')
const newRoute = createAction('NEW_ROUTE')
const setToast = createAction('SET_TOAST')
const stopRun = createAction('STOP_RUN')
const refresh = createAction('refresh')
const endRun = createAction('END_RUN')
const reset = createAction('RESET')

function initializeApp () {
  return bindUrl(newRoute)
}

function * saveProgress (animals, gameID, saveID) {
  const id = saveID ? saveID : yield createCode('/saved')
  yield refMethod({
    ref: 'saved/' + id,
    updates: {
      method: 'transaction',
      value: (cur) => {
        if (saveID && cur === null) {
          return 0
        }
        if (gameID) {
          cur.gameID = gameID
        }
        cur = cur ? cur : {}
        cur.animals = animals.map((animal) => ({...animal, current: animal.initial}))
        return cur
      }
    }
  })
  if (!saveID) {
    yield setUrl(`/saved/${id}`)
    yield endRunMessage({header: 'Saved Game', body: 'http://pixelbots.io/saved/' + id})
  }
  yield setToast('Saved')
  yield sleep(3000)
  yield setToast('')
}

function * createNew () {
  const {key} = yield refMethod({updates: {method: 'push', value: ' '}, ref: '/drafts'})
  yield setUrl(`/create/${key}/animal`)
}

export {
  initializeGame,
  setActiveLine,
  endRunMessage,
  initializeApp,
  clearMessage,
  saveProgress,
  setAnimalPos,
  setGameData,
  animalPaint,
  paintSquare,
  handleError,
  removeLine,
  throwError,
  animalMove,
  animalTurn,
  turnAnimal,
  updateLine,
  gameLoaded,
  updateSize,
  setSaveId,
  selectLine,
  moveAnimal,
  codeAdded,
  setActive,
  setAnimal,
  createNew,
  moveError,
  aceUpdate,
  setToast,
  swapMode,
  startRun,
  newRoute,
  stopRun,
  addCode,
  refresh,
  endRun,
  reset
}
