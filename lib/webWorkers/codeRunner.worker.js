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

import { getInterval } from 'utils/animal'
// import mapValues from '@f/map-values'
import stackTrace from 'stack-trace'
import createApi from 'animalApis'
// import filter from '@f/filter'
import sleep from '@f/sleep'
import frameReducer, {
  createIterator,
  getIterator,
  createFrames,
  checkBounds,
  getLastFrame
} from 'utils/frameReducer'

import 'regenerator-runtime/runtime'

self.addEventListener('message', ({ data: { type, payload } }) => {
  if (type === 'play') {
    postMessage({ type: 'newState', payload: { hasRun: true, running: true } })
    runners.setRunning(true).runBot(...runners.iterator)
  } else if (type === 'init') {
    runners.initialize(payload).createRunner()
  } else if (type === 'pause') {
    runners.setRunning(false)
    runners.newState({ running: false })
  } else if (type === 'step') {
    runners.step(...runners.iterator, false)
  } else if (type === 'updateSpeed') {
    runners.setSpeed(payload)
  }
})

const runners = {
  iterator: undefined,
  currentState: undefined,

  initialize (initState) {
    this.currentState = initState
    return this
  },

  setSpeed (speed) {
    this.currentState = { ...this.currentState, speed }
    return this
  },

  setRunning (running) {
    this.currentState = { ...this.currentState, running }
    return this
  },

  setInDrawLoop (inDrawLoop) {
    this.currentState = { ...this.currentState, inDrawLoop }
    return this
  },

  resetPaintedToInitial () {
    this.currentState = {
      ...this.currentState,
      painted: this.currentState.initialPainted
    }
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
      type: 'throwError',
      payload: {
        type: 'error',
        body: `${e.message}. Check the code at line ${errorLine + 1}.`,
        header: 'Error'
      }
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
    }
  },

  runBot (it, i, returnValue) {
    const { running, drawing, speed, steps } = this.currentState
    this.iterator = [it, i, returnValue]
    if (!running) {
      this.newState({ animals: toggleActiveBot(this.currentState, false) })
      return
    } else if (drawing) {
      this.newState({ animals: toggleActiveBot(this.currentState, true) })
    }
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

  step (it, i, returnValue, shouldContinue = true) {
    const { drawing, inDrawLoop, painted, initialPainted } = this.currentState
    if (drawing) {
      if (shouldContinue) {
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
    return this.setFrameValue(
      value,
      frame,
      it,
      i,
      newReturnValue,
      shouldContinue
    )
  },

  handleStepAction (action) {
    const { initialPainted } = this.currentState

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

  setFrameValue (value, frame, it, i, newReturnValue, shouldContinue = true) {
    const { levelSize, active, steps } = this.currentState
    const currentLocation = frame.animals[frame.active].current.location
    const [lineNum] = value.payload

    if (!checkBounds(currentLocation, levelSize)) {
      return this.throwError({
        message: 'Out of bounds',
        lineNum: lineNum - 1
      })
    }
    this.newState({
      ...frame,
      active,
      steps: steps + 1,
      activeLine: lineNum
    })
    return shouldContinue ? [it, i, newReturnValue] : null
  }
}

function toggleActiveBot (state, hidden) {
  return state.animals.map(
    (a, i) => (i === state.active ? { ...a, hidden } : a)
  )
}

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
