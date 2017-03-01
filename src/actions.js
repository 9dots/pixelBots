import createAction from '@f/create-action'
import {bindUrl, setUrl} from 'redux-effects-location'
import {refMethod, set} from 'vdux-fire'
import {createCode, initGame, fbTask} from './utils'
import pick from 'lodash/pick'
import omit from '@f/omit'

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
const togglePermission = createAction('TOGGLE_PERMISSION')
const incrementalPaint = createAction('INCREMENTAL_PAINT')
const setModalMessage = createAction('SET_MODAL_MESSAGE')
const setPlaylistKey = createAction('SET_PLAYLIST_KEY')
const initializeGame = createAction('INITIALIZE_GAME')
const setActiveLine = createAction('SET_ACTIVE_LINE')
const incrementLine = createAction('INCREMENT_LINE')
const setActive = createAction('SET_ANIMAL_ACTIVE')
const setAnimalPos = createAction('SET_ANIMAL_POS')
const addStartCode = createAction('ADD_START_CODE')
const clearMessage = createAction('CLEAR_MESSAGE')
const setGameData = createAction('SET_GAME_DATA')
const handleError = createAction('HANDLE_ERROR')
const selectLine = createAction('SELECT_LINE')
const gameLoaded = createAction('GAME_LOADED')
const updateLine = createAction('UPDATE_LINE')
const removeLine = createAction('REMOVE_LINE')
const updateSize = createAction('UPDATE_SIZE')
const setGameId = createAction('SET_GAME_ID')
const setSaveId = createAction('SET_SAVE_ID')
const aceUpdate = createAction('ACE_UPDATE')
const setAnimal = createAction('SET_ANIMAL')
const codeAdded = createAction('CODE_ADDED')
const setPaint = createAction('SET_PAINT')
const swapMode = createAction('SWAP_MODE')
const setSaved = createAction('SET_SAVED')
const startRun = createAction('START_RUN')
const newRoute = createAction('NEW_ROUTE')
const setToast = createAction('SET_TOAST')
const setSpeed = createAction('SET_SPEED')
const setTitle = createAction('SET_NAME')
const stopRun = createAction('STOP_RUN')
const addCode = createAction('ADD_CODE')
const refresh = createAction('refresh')
const endRun = createAction('END_RUN')
const reset = createAction('RESET')

function initializeApp () {
  return bindUrl(updateRoute)
}

function * updateRoute (url) {
  if (window.location.origin !== 'http://localhost:5000') {
    yield ga('set', 'page', url)
  }
  yield newRoute(url)
}

function * saveProgress (game, saveID, gameID, uid) {
  const {animals, targetPainted} = game
  yield fbTask('on_save', {
    targetPainted,
    animals,
    saveID,
    gameID,
    uid
  })
  yield setSaved(true)
}

function updatePlaylist (ref) {
  return function * (data) {
    yield fbTask('update_playlist', {
      updates: data,
      ref
    })
  }
}

function * completeChallenge (data) {
  const {game, uid, gameID, playlistKey = '', saveID} = data
  const linkRef = yield createCode()
  console.log(playlistKey)
  if (playlistKey) {
    yield set(`/users/${uid}/lists/${playlistKey}/completed/${gameID}`, saveID)
  }

  yield fbTask('on_complete', {
    ...omit('playlistKey', data),
    linkRef,
    code: game.animals[0].sequence
  })
}

function updateGame (ref) {
  return function * (data) {
    try {
      yield refMethod({
        updates: {method: 'update', value: {lastEdited: Date.now(), ...data}},
        ref
      })
      // yield fbTask('update_game', {
      //   updates: data,
      //   ref
      // })
    } catch (e) {
      console.warn(e)
    }
  }
}

function * createNew (uid) {
  const {key} = yield refMethod({
    ref: '/drafts',
    updates: {method: 'push', value: {creatorID: uid, ...initGame()}}
  })
  yield refMethod({
    ref: `/users/${uid}/drafts`,
    updates: {method: 'push', value: {ref: key}}
  })
  yield setUrl(`/create/${key}`)
}

export {
  completeChallenge,
  incrementalPaint,
  togglePermission,
  setModalMessage,
  setPlaylistKey,
  initializeGame,
  updatePlaylist,
  setActiveLine,
  incrementLine,
  initializeApp,
  clearMessage,
  saveProgress,
  addStartCode,
  setAnimalPos,
  setGameData,
  animalPaint,
  paintSquare,
  handleError,
  updateGame,
  removeLine,
  throwError,
  animalMove,
  animalTurn,
  turnAnimal,
  updateLine,
  gameLoaded,
  updateSize,
  setSaveId,
  setGameId,
  selectLine,
  moveAnimal,
  codeAdded,
  setActive,
  setAnimal,
  createNew,
  moveError,
  aceUpdate,
  setSaved,
  setToast,
  setPaint,
  setSpeed,
  swapMode,
  startRun,
  newRoute,
  stopRun,
  setTitle,
  addCode,
  refresh,
  endRun,
  reset
}
