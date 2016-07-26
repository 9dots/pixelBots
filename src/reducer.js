import {turtleForward, turtleTurnRight, turtlePaint} from './actions'

function reducer (state, action) {
  switch (action.type) {
    case turtleForward.type:
      var id = action.payload
      return {
        ...state,
        turtles: {
          ...state.turtles,
          [id]: {
            ...state.turtles[id],
            location: getNewLocation(state.turtles[id].location, state.turtles[id].dir)
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
            dir: (state.turtles[id].dir + 1) % 3
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
  }
  return state
}

function getNewLocation (oldLoc, dir) {
  if (dir === 0) {
    return [oldLoc[0] - 1, oldLoc[1]]
  } else if (dir === 2) {
    return [oldLoc[0] + 1, oldLoc[1]]
  } else if (dir === 3) {
    return [oldLoc[0], oldLoc[1] - 1]
  } else if (dir === 1) {
    return [oldLoc[0], oldLoc[1] + 1]
  }
}

export default reducer
