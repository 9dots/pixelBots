import equal from '@f/equal'

import {
  turtleTurnRight,
  turtleTurnLeft,
  turtleForward,
  turtlePaint,
  turtleErase,
  turtleMove,
  setActive,
  runCode,
  addCode,
  removeLine,
  startRun,
  stopRun,
  setActiveLine
} from './actions'

function reducer (state, action) {
  switch (action.type) {
    case turtleMove.type:
      var {id, location} = action.payload
      return {
        ...state,
        turtles: {
          ...state.turtles,
          [id]: {
            ...state.turtles[id],
            location
          }
        }
      }
    case turtleTurnRight.type:
      var id = action.payload
      return {
        ...state,
        turtles: {
          ...state.turtles,
          [id]: {
            ...state.turtles[id],
            dir: (state.turtles[id].dir + 1) % 4,
            rot: state.turtles[id].rot + 1
          }
        }
      }
    case turtleTurnLeft.type:
        var id = action.payload
        return {
          ...state,
          turtles: {
            ...state.turtles,
            [id]: {
              ...state.turtles[id],
              dir: (state.turtles[id].dir + 3) % 4,
              rot: state.turtles[id].rot - 1
            }
          }
        }
    case turtlePaint.type:
      var id = action.payload
      var loc = state.turtles[id].location

      return {
        ...state,
        painted: [...state.painted, loc]
      }
    case turtleErase.type:
      var id = action.payload
      var loc = state.turtles[id].location
      return {
        ...state,
        painted: state.painted.filter((paint) => !equal(paint, loc))
      }
    case setActive.type:
      var id = action.payload
      return {
        ...state,
        active: id
      }
    case addCode.type:
      var {id, fn} = action.payload
      return {
        ...state,
        turtles: {
          ...state.turtles,
          [id]: {
            ...state.turtles[id],
            sequence: [...state.turtles[id].sequence, fn]
          }
        }
      }
    case removeLine.type:
      var {id, idx} = action.payload
      return {
        ...state,
        turtles: {
          ...state.turtles,
          [id]: {
            ...state.turtles[id],
            sequence: state.turtles[id].sequence.filter((line, i) => i !== idx)
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
  }
  return state
}

export default reducer
