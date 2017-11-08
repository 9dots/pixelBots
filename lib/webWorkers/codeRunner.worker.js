/**
 * State required for code running:
 * 
 * animals
 * initialPainted
 * painted
 * capabilities
 * palette
 * active
 */

/**
 * Incoming messages:
 * 
 * play/pause toggle
 * step forward
 * setSpeed
 */

/**
 * Outgoing messages:
 * 
 * newState
 * throwError
 * done
 */

import frameReducer, {
  createIterator,
  getIterator,
  createFrames,
  checkBounds,
  getLastFrame
} from 'utils/frameReducer'
import { getInterval } from 'utils/animal'
import mapValues from '@f/map-values'
import createApi from 'animalApis'
import stackTrace from 'stack-trace'
import filter from '@f/filter'
import sleep from '@f/sleep'

import 'regenerator-runtime/runtime'

const runners = {
  iterator: undefined,
  currentState: undefined,

  initialize (initState) {
    this.currentState = initState
    return this
  },

  newState (payload) {
    postMessage({ type: 'newState', payload })
    this.currentState = {
      ...this.currentState,
      ...payload
    }
  },

  done () {
    postMessage({ type: 'done' })
  },

  throwError (e) {
    const { lineNum } = e
    const errorLine =
      typeof lineNum === 'number'
        ? lineNum
        : stackTrace.parse(e.e ? e.e : e)[0].lineNumber - 5

    postMessage({
      type: 'error',
      body: `${e.message}. Check the code at line ${errorLine + 1}.`,
      header: 'Error'
    })
  },

  createRunner () {
    try {
      const { animals, active, capabilities, palette } = this.currentState
      const animal = animals[active]

      this.iterator = [
        createIterator(
          getIterator(animal.sequence, createApi(capabilities, active, palette))
        ),
        active,
        null
      ]
    } catch (e) {
      this.throwError(e)
      th
    }
  },

  runBot (it, i, returnValue) {
    const { running, drawing, speed, steps } = this.currentState
    this.iterator = [it, i, returnValue]
    // if (!running) {
    //   this.newState({ animals: toggleActiveBot(this.currentState, false) })
    //   return
    // } else if (drawing) {
    //   this.newState({ animals: toggleActiveBot(this.currentState, true) })
    // }
    const interval = getInterval(null, speed)
    const args = this.step(it, i, returnValue)
    if (args) {
      if (speed <= 50 || steps % (Math.floor((speed - 50) / 7) || 1) === 0) {
        return sleep(interval).then(() => this.runBot(...args))
      }
      return this.runBot(...args)
    } else {
      return this.done()
    }
  },

  step (it, i, returnValue) {
    const {
      drawing,
      inDrawLoop,
      stepping,
      painted,
      initialPainted
    } = this.currentState
    if (drawing) {
      if (!stepping) {
        const frames = createFrames(
          {
            ...this.currentState,
            painted: inDrawLoop ? painted : initialPainted
          },
          it,
          action => action.type === 'endDrawLoop'
        )
        return this.setFrameValue(
          { payload: [0] },
          { ...frames[frames.length - 1], inDrawLoop: false },
          it,
          i
        )
      } else {
        if (!inDrawLoop) {
          this.resetPaintedToInitial()
        }
        this.setInDrawLoop(true)
      }
    }

    const { value, done } = it.next(returnValue)

    if (done) {
      return
    }

    const [frame, newReturnValue] = this.handleStepAction(value)
    return this.setFrameValue(value, frame, it, i, newReturnValue)
  },

  handleStepAction (action) {
    const { initialPainted } = this.currentState
    // const [lineNum, ...args] = action.payload && action.payload

    if (action.type === 'throwError') {
      this.throwError(...action.payload)
      return
    } else if (action.type === 'endDrawLoop') {
      return [
        { ...this.currentState, painted: initialPainted, inDrawLoop: false }
      ]
    }
    return frameReducer(
      this.currentState,
      action.type,
      (action.payload || []).slice(1)
    )
  },

  setFrameValue (value, frame, it, i, newReturnValue) {
    const { levelSize, active } = this.currentState
    const currentLocation = frame.animals[frame.active].current.location
    const [lineNum] = value.payload

    if (!checkBounds(currentLocation, levelSize)) {
      return this.throwError({
        message: 'Out of bounds',
        lineNum: lineNum - 1
      })
    } else {
      this.newState({
        ...frame,
        active,
        activeLine: lineNum
      })
    }
    return [it, i, newReturnValue]
  }
}

self.addEventListener('message', ({ data: { type, payload } }) => {
  if (!runners.iterators) {
    runners.initialize(payload).createRunner()
  }

  if (type === 'play') {
    postMessage({ type: 'newState', payload: { hasRun: true, running: true } })
    runners.runBot(...runners.iterator)
  } else if (type === 'pause') {
    postMessage({ type: 'adf', payload: {} })
  } else if (type === 'step') {
    postMessage({ type: 'adf', payload: {} })
  }
})

function toggleActiveBot (state, hidden) {
  return state.animals.map(
    (a, i) => (i === state.active ? { ...a, hidden } : a)
  )
}

// function * run ({ actions, state }) {
//   const { pauseState, runners } = state
//   yield sleep(100)
//   pauseState
//     ? yield mapValues(
//       ({ it, i, returnValue }) => actions.runBot(it, i, returnValue),
//       pauseState
//     )
//     : yield runners.map((it, i) => actions.runBot(it, i))
// }

// function * stepForward ({ props, state, actions }) {
//   const {
//     hasRun,
//     animals,
//     pauseState,
//     stepping,
//     initialPainted,
//     editorIsDirty
//   } = state

//   if (stepping) {
//     return
//   }

//   yield props.incrementStepperSteps()
//   yield actions.setStepping(true)

//   if (!hasRun || editorIsDirty) {
//     yield actions.resetBoard({
//       animals: animals.map(a => ({ ...a, current: a.initial })),
//       painted: initialPainted
//     })

//     const newRunners = yield actions.createRunners(
//       animals.filter(a => a.type !== 'teacherBot')
//     )
//     if (!newRunners) {
//       return
//     }
//     yield actions.revealTogglePaints()
//     const its = yield newRunners.map(actions.step)
//     yield its.map(([it, i, returnValue]) =>
//       actions.setPauseState({ it, i, returnValue })
//     )
//     yield actions.setHasRun(true)
//   } else {
//     const its = yield mapValues(
//       ({ it, i, returnValue }) => actions.step(it, i, returnValue),
//       pauseState
//     )
//     if (Object.keys(its.filter(res => !!res)).length < 1) {
//       yield actions.onRunFinish()
//     } else {
//       yield its.map(([it, i, returnValue]) =>
//         actions.setPauseState({ it, i, returnValue })
//       )
//     }
//   }

//   yield actions.setStepping(false)
// }

// function * runBot ({ actions, state }, it, i, returnValue) {
//   const { running, drawing } = state
//   if (!running) {
//     yield actions.toggleActiveBot(false)
//     return yield actions.setPauseState({ it, i, returnValue })
//   } else if (drawing) {
//     yield actions.toggleActiveBot(true)
//   }

//   const interval = getInterval(null, state.speed)
//   const args = yield actions.step(it, i, returnValue)

//   if (args) {
//     if (
//       state.speed <= 50 ||
//       state.steps % (Math.floor((state.speed - 50) / 7) || 1) === 0
//     ) {
//       yield sleep(interval)
//     }
//     yield actions.runBot(...args)
//   } else {
//     yield actions.onRunFinish()
//   }
// }

// function * step ({ state, actions }, it, i, returnValue) {
//   const { drawing, inDrawLoop, stepping } = state
//   if (drawing) {
//     if (!stepping) {
//       const frames = createFrames(
//         {
//           ...state,
//           painted: inDrawLoop ? state.painted : state.initialPainted
//         },
//         it,
//         action => action.type === 'endDrawLoop'
//       )
//       return yield actions.setFrameValue(
//         { payload: [0] },
//         { ...frames[frames.length - 1], inDrawLoop: false },
//         it,
//         i
//       )
//     } else {
//       if (!inDrawLoop) {
//         yield actions.resetPaintedToInitial()
//       }
//       yield actions.setInDrawLoop(true)
//     }
//   }

//   const { value, done } = it.next(returnValue)

//   if (done) {
//     return
//   }

//   const [frame, newReturnValue] = yield actions.handleStepAction(value)
//   return yield actions.setFrameValue(value, frame, it, i, newReturnValue)
// }

// function * handleStepAction ({ actions, state, props }, action) {
//   const { animals, teacherRunning } = state
//   // const [lineNum, ...args] = action.payload && action.payload

//   if (action.type === 'throwError') {
//     yield actions.throwError(...action.payload)
//     return
//   } else if (action.type === 'endDrawLoop') {
//     return [{ ...state, painted: state.initialPainted, inDrawLoop: false }]
//   }
//   return frameReducer(
//     {
//       ...state,
//       active: teacherRunning ? animals.length - 1 : state.active
//     },
//     action.type,
//     (action.payload || []).slice(1)
//   )
// }

// function * setFrameValue (
//   { actions, state },
//   value,
//   frame,
//   it,
//   i,
//   newReturnValue
// ) {
//   const { levelSize } = state
//   const currentLocation = frame.animals[frame.active].current.location
//   const [lineNum] = value.payload

//   if (!checkBounds(currentLocation, levelSize)) {
//     yield actions.throwError({
//       message: 'Out of bounds',
//       lineNum: lineNum - 1
//     })
//   } else {
//     yield actions.setFrame({
//       ...frame,
//       active: state.active,
//       activeLine: lineNum
//     })
//   }
//   return [it, i, newReturnValue]
// }

// function * runCheck ({ actions, state }) {
//   const { animals, active, capabilities, palette } = state
//   yield sleep(1000)
//   yield actions.revealTogglePaints()
//   const startCode = getIterator(
//     animals[active].sequence,
//     createApi(capabilities, animals.length - 1, palette)
//   )
//   const it = createIterator(startCode)
//   yield actions.setTeacherRunning(true)
//   yield actions.runTeacherBot(it, animals.length - 1)
//   yield actions.setEditorIsDirty(true)
//   yield actions.setTeacherRunning(false)
// }

// function * revealTogglePaints ({ state, actions }) {
//   const { initialData, rand } = state
//   const { initialPainted } = initialData
//   const togglePaints = filter(val => val === 'toggle', initialPainted)
//   const toggleColors = ['blue', 'yellow']
//   yield actions.setTeacherRunning(true)
//   for (let loc in togglePaints) {
//     const color = toggleColors[Math.floor(rand(2, 0))]
//     for (let i = 0; i < 6; i++) {
//       yield actions.revealTogglePixel(loc, toggleColors[i % 2], i)
//     }
//     yield actions.paintTogglePixel(loc, color)
//   }
//   yield actions.setTeacherRunning(false)
// }

// function * revealTogglePixel ({ state, actions }, loc, color, i) {
//   const { speed } = state
//   const pause = 1000 / Math.log(speed * 2)
//   yield actions.setPainted('painted', loc, color)
//   yield sleep(pause / (8 - i))
// }

// function * paintTogglePixel ({ state, actions }, loc, color) {
//   const { speed } = state
//   const pause = 1000 / Math.log(speed * 2)
//   yield actions.setPainted('painted', loc, color)
//   yield sleep(pause / 2)
// }

// function * getAdvancedPainted ({ state, actions }) {
//   const { solution, capabilities, palette } = state
//   if (solution) {
//     yield actions.setTargetPainted(
//       getLastFrame(
//         state,
//         getIterator(solution[0].sequence, createApi(capabilities, 0, palette))
//       )
//     )
//   }
// }

// function * controllerMove ({ props, state, actions }, fn, ...args) {
//   const { active } = state
//   const frame = fn(state, active, ...args)
//   const location = frame.animals[frame.active].current.location
//   if (checkBounds(location, state.levelSize)) {
//     yield actions.setFrame(frame)
//   }
// }

// function * runTeacherBot ({ actions, state }, it, i, returnValue) {
//   const interval = getInterval(null, state.speed)
//   const args = yield actions.step(it, i, returnValue)
//   if (args && state.teacherRunning) {
//     yield sleep(interval)
//     yield actions.runTeacherBot(...args)
//   } else {
//     yield sleep(500)
//     yield actions.removeTeacherBot()
//     yield sleep(100)
//     yield actions.animalMove(
//       state.animals.length - 1,
//       state.animals[state.animals.length - 1].initial.location
//     )
//     if (!state.teacherRunning) {
//       throw new Error('uh oh')
//     }
//   }
// }

// function throwError (e) {}
