import equal from '@f/equal'
import map from '@f/map'

import {
  turtleTurnRight,
  turtleTurnLeft,
  turtlePaint,
  turtleErase,
  turtleMove,
  setActive,
  addCode,
  removeLine,
  startRun,
  stopRun,
  reset,
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
            current: {
              ...state.turtles[id].current,
              location
            }
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
            current: {
              ...state.turtles[id].current,
              dir: (state.turtles[id].current.dir + 1) % 4,
              rot: state.turtles[id].current.rot + 1
            }
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
            current: {
              ...state.turtles[id].current,
              dir: (state.turtles[id].current.dir + 3) % 4,
              rot: state.turtles[id].current.rot - 1
            }
          }
        }
      }
    case turtlePaint.type:
      var {id, color} = action.payload
      var loc = state.turtles[id].current.location

      return {
        ...state,
        painted: [...state.painted, {loc, color}]
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
    case reset.type:
      return {
        ...state,
        running: false,
        painted: state.initialPainted,
        turtles: map((turtle) => ({
          ...turtle,
          current: turtle.initial
        }), state.turtles)
      }
  }
  return state
}

export default reducer
