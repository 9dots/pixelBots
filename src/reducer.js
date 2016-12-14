import map from '@f/map'
import splice from '@f/splice'
import setProp from '@f/set-prop'
import reduce from '@f/reduce'
import {initGame, arrayAt} from './utils'

import {setUserId, setUsername, setUserProfile} from './middleware/auth'

import {
  initializeGame,
  setActiveLine,
  endRunMessage,
  clearMessage,
  setAnimalPos,
  animalPaint,
  handleError,
  animalTurn,
  removeLine,
  animalMove,
  updateLine,
  setSaveId,
  setGameId,
  updateSize,
  selectLine,
  setActive,
  setAnimal,
  aceUpdate,
  swapMode,
  newRoute,
  startRun,
  setToast,
  stopRun,
  addCode,
  refresh,
  endRun,
  reset
} from './actions'

function reducer (state, action) {
  switch (action.type) {
    case animalMove.type:
      var {id, location} = action.payload
      return {
        ...state,
        game: arrayAt(
          setProp(`animals.${id}.current.location`, state.game, location),
         'animals'
       )
      }
    case animalTurn.type:
      var {id, rot} = action.payload
      return {
        ...state,
        game: arrayAt(
          setProp(`animals.${id}.current.rot`, state.game, rot),
          'animals'
        )
      }
    case animalPaint.type:
      var {id, color} = action.payload
      var loc = state.game.animals[id].current.location

      return {
        ...state,
        game: arrayAt(setProp(
          'painted',
          state.game,
          {...state.game.painted, [loc]: color}
        ), 'animals')
      }
    case setActive.type:
      var id = action.payload
      return {
        ...state,
        active: id
      }
    case selectLine.type:
      var {id, idx} = action.payload
      return {
        ...state,
        selectedLine: idx
      }
    case addCode.type:
      var {id, code, idx} = action.payload
      var lineNum = idx || typeof (state.selectedLine) === 'number'
        ? state.selectedLine
        : null
      return {
        ...state,
        selectedLine: state.selectedLine + 1,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          splice(state.game.animals[id].sequence || [], lineNum, 0, code)
        ), 'animals')
      }
    case removeLine.type:
      var {id, idx} = action.payload
      var sequence = state.game.animals[id].sequence
      var sl = state.selectedLine >= sequence.length
        ? sequence.length - 1
        : state.selectedLine

      return {
        ...state,
        selectedLine: sl,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          state.game.animals[id].sequence.filter((line, i) => i !== idx)
        ), 'animals')
      }
    case startRun.type:
      return {
        ...state,
        running: true,
        hasRun: true
      }
    case stopRun.type:
      return {
        ...state,
        running: false
      }
    case setActiveLine.type:
      return {
        ...state,
        activeLine: action.payload
      }
    case aceUpdate.type:
      var {id, code} = action.payload
      return {
        ...state,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          code
        ), 'animals')
      }
    case updateLine.type:
      var {id, lineNum, code} = action.payload
      return {
        ...state,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          splice(state.game.animals[id].sequence, lineNum, 1, code)
        ), 'animals')
      }
    case refresh.type:
      return {
        ...state,
        running: false,
        hasRun: false,
        activeLine: -1,
        saveID: undefined,
        gameID: undefined,
        game: initGame()
      }
    case reset.type:
      return {
        ...state,
        running: false,
        hasRun: false,
        activeLine: -1,
        game: {
          ...state.game,
          painted: state.game.initialPainted,
          animals: map((animal) => ({
            ...animal,
            current: animal.initial
          }), state.game.animals)
        }
      }
    case handleError.type:
      var {message, lineNum} = action.payload
      return {
        ...state,
        message: {
          type: 'error',
          header: message,
          body: `Check the code at line ${lineNum + 1}`
        },
        activeLine: lineNum
      }
    case endRunMessage.type:
      var {header, body} = action.payload
      return {
        ...state,
        message: {
          type: 'win',
          header,
          body
        }
      }
    case clearMessage.type:
      return {
        ...state,
        message: undefined,
        activeLine: -1
      }
    case newRoute.type:
      return {
        ...state,
        url: action.payload
      }
    case initializeGame.type:
      return {
        ...state,
        game: {
          ...action.payload,
          animals: action.payload.animals.map((animal) => ({
            ...animal,
            sequence: !animal.sequence || animal.sequence.length === 0 
              ? action.payload.startCode || []
              : animal.sequence
          }))
        }
      }
    case endRun.type:
      return {
        ...state,
        running: false
      }
    case swapMode.type:
      return {
        ...state,
        game: {
          ...state.game,
          inputType: action.payload,
          painted: state.game.initialPainted,
          animals: map((animal) => ({
            ...animal,
            current: animal.initial,
            sequence: ''
          }), state.game.animals)
        }
      }
    case setUserId.type:
      return {
        ...state,
        user: action.payload
      }
    case updateSize.type:
      return {
        ...state,
        game: {
          ...state.game,
          levelSize: [action.payload, action.payload],
          animals: state.game.animals.map((animal) => setNewAnimalPos([0,0], animal))
        }
      }
    case setAnimal.type:
      return {
        ...state,
        game: setProp('animals', state.game, state.game.animals.map((animal) => ({...animal, type: action.payload})))
      }
    case setAnimalPos.type:
      return {
        ...state,
        game: {
          ...state.game,
          animals: state.game.animals.map((animal) => {
            return {
              ...animal,
              current: {
                dir: 0,
                rot: 0,
                location: action.payload
              },
              initial: {
                dir: 0,
                rot: 0,
                location: action.payload
              }
            }
          })
        }
      }
    case setToast.type:
      return {
        ...state,
        toast: action.payload
      }
    case setSaveId.type:
      return {
        ...state,
        saveID: action.payload
      }
    case setGameId.type:
      return {
        ...state,
        gameID: action.payload
      }
    case setUsername.type:
      return {
        ...state,
        username: action.payload
      }
    case setUserProfile.type:
      return {
        ...state,
        profile: action.payload
      }
  }
  return state
}

function setNewAnimalPos (coords, animal) {
  return {
    ...animal,
    initial: {
      location: coords,
      dir: 0,
      rot: 0
    },
    current: {
      location: coords,
      dir: 0,
      rot: 0
    }
  }
}


export default reducer
