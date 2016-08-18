import map from '@f/map'
import splice from '@f/splice'

import {
  setActiveLine,
  animalPaint,
  removeLine,
  animalMove,
  updateLine,
  selectLine,
  setActive,
  addCode,
  startRun,
  stopRun,
  reset
} from './actions'

function reducer (state, action) {
  switch (action.type) {
    case animalMove.type:
      var {id, location} = action.payload
      return {
        ...state,
        animals: {
          ...state.animals,
          [id]: {
            ...state.animals[id],
            current: {
              ...state.animals[id].current,
              location
            }
          }
        }
      }
    case animalPaint.type:
      var {id, color} = action.payload
      var loc = state.animals[id].current.location

      return {
        ...state,
        painted: [...state.painted, {loc, color}]
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
      var lineNum = typeof (state.selectedLine) === 'number' ? state.selectedLine : null
      return {
        ...state,
        selectedLine: state.selectedLine ? state.selectedLine + 1 : null,
        animals: {
          ...state.animals,
          [id]: {
            ...state.animals[id],
            sequence: lineNum ? splice(state.animals[id].sequence, lineNum, 0, fn)  : [...state.animals[id].sequence, fn]
          }
        }
      }
    case removeLine.type:
      var {id, idx} = action.payload
      return {
        ...state,
        animals: {
          ...state.animals,
          [id]: {
            ...state.animals[id],
            sequence: state.animals[id].sequence.filter((line, i) => i !== idx)
          }
        }
      }
    case startRun.type:
      return {
        ...state,
        running: true
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
    case updateLine.type:
      var {id, lineNum, code} = action.payload
      return {
        ...state,
        animals: {
          ...state.animals,
          [id]: {
            ...state.animals[id],
            sequence: splice(state.animals[id].sequence, lineNum, 1, code)
          }
        }
      }
    case reset.type:
      return {
        ...state,
        running: false,
        painted: state.initialPainted,
        animals: map((animal) => ({
          ...animal,
          current: animal.initial
        }), state.animals)
      }
  }
  return state
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
