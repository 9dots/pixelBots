import map from '@f/map'
import splice from '@f/splice'
import setProp from '@f/set-prop'
import reduce from '@f/reduce'

import {
  initializeGame,
  setActiveLine,
  endRunMessage,
  animalPaint,
  handleError,
  removeLine,
  animalMove,
  updateLine,
  selectLine,
  clearMessage,
  setActive,
  aceUpdate,
  newRoute,
  startRun,
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
      var {id, fn, idx} = action.payload
      var lineNum = typeof (state.selectedLine) === 'number'
        ? state.selectedLine
        : null
      return {
        ...state,
        selectedLine: state.selectedLine + 1,
        game: arrayAt(setProp(
          `animals.${id}.sequence`,
          state.game,
          splice(state.game.animals[id].sequence || [], lineNum, 0, fn)
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
        game: null
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
        game: action.payload
      }
    case endRun.type:
      return {
        ...state,
        running: false
      }
    // case swapMode.type:
    //   return {
    //     ...state,
    //     inputType: state.inputType === 'code' ? 'icons' : 'code',
    //     animals: map((animal) => ({...animal, sequence: []}), state.animals)
    //   }
  }
  return state
}

function arrayAt (obj, at) {
  return map((elem, key) => {
    if (key === at) {
      return reduce((arr, next, k) => [...arr, next], [], elem)
    }
    return elem
  }, obj)
}

// case animalTurnRight.type:
//   var id = action.payload
//   return {
//     ...state,
//     animals: {
//       ...state.animals,
//       [id]: {
//         ...state.animals[id],
//         current: {
//           ...state.animals[id].current,
//           dir: (state.animals[id].current.dir + 1) % 4,
//           rot: state.animals[id].current.rot + 1
//         }
//       }
//     }
//   }
// case animalTurnLeft.type:
//   var id = action.payload
//   return {
//     ...state,
//     animals: {
//       ...state.animals,
//       [id]: {
//         ...state.animals[id],
//         current: {
//           ...state.animals[id].current,
//           dir: (state.animals[id].current.dir + 3) % 4,
//           rot: state.animals[id].current.rot - 1
//         }
//       }
//     }
//   }

export default reducer
