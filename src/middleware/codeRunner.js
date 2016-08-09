import createAction from '@f/create-action'
import autoYield from 'auto-yield'
import sleep from '@f/sleep'

import {
  turtleForward,
  turtleTurnRight,
  turtleTurnLeft,
  turtlePaint,
  turtleErase,
  turtleMove,
  stopRun,
  startRun,
  setActiveLine,
  moveError
} from '../actions'

const runCode = createAction('RUN_CODE')
const TIMEOUT = 500

function codeRunner () {
  return ({getState, dispatch}) => {
    const turnLeft = (id) => turtleTurnLeft(id)
    const turnRight = (id) => turtleTurnRight(id)
    const setLine = (num) => setActiveLine(num)
    const forward = (id) => turtleForward(id)
    const paint = (id) => turtlePaint(id)
    const erase = (id) => turtleErase(id)
    const start = () => startRun()
    const stop = () => stopRun()

    function runner (turtle, id) {
      let {sequence} = turtle
      sequence = sequence.map((line, i) => `${line.split('\(')[0]}(${id})\nsetLine(${i})\nsleep(${TIMEOUT})`)
      let code = autoYield(sequence.join('\n'), ['forward', 'turnLeft', 'turnRight', 'paint', 'erase', 'sleep', 'setLine'])
      let fn = `var sleep = require('@f/sleep')
      function * codeRunner () {
        yield start()
        ${code}
        yield stop()
      }
      codeRunner()
      `
      return eval(fn)
    }

    return (next) => (action) => {
      let state = getState()
      if (action.type === runCode.type && !state.running) {
        const turtles = state.turtles
        for (var id in turtles) {
          dispatch(runner(turtles[id], id))
        }
      }

      if (action.type === turtleForward.type) {
        const turtle = state.turtles[action.payload]
        const location = getNewLocation(turtle.current.location, turtle.current.dir)
        if (checkBounds(location, state.levelSize)) {
          dispatch(turtleMove(action.payload, location))
        } else {
          dispatch([stopRun(), moveError()])
        }
      }

      return next(action)
    }
  }
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

function checkBounds (location, level) {
  for (var coord in location) {
    if (location[coord] >= level[coord] || location[coord] < 0) {
      return false
    }
  }
  return true
}

export default codeRunner
export {
  runCode
}
