/**
 * Imports
 */

import frameReducer, {
  createIteratorQ, checkBounds, isEqualSequence, updateAnimal,
  createIterator, getIterator, setAnimalPos
} from 'utils/frameReducer'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import initialGameState from 'utils/initialGameState'
import createApi, {createDocs} from 'animalApis'
import {getInterval} from 'utils/animal'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import stackTrace from 'stack-trace'
import setProp from '@f/set-prop'
import sleep from '@f/sleep'

/**
 * <Game/>
 */

function teacherBot (levelSize) {
  return {
    type: 'teacherBot',
    current: {
      location: [levelSize[0] - 1, 0],
      rot: 0
    },
    initial: {
      location: [levelSize[0] - 1, 0],
      rot: 0
    },
    hidden: false
  }
}

function toggleTeacherBot (animals, toggle) {
  return animals.map(a => {
    return a.type !== 'teacherBot'
			? {...a, hidden: toggle}
			: {...a, hidden: !toggle}
  })
}

export default component({
  initialState ({props}) {
    const {game, savedGame, initialData = {}} = props
    if (Object.keys(initialData).length > 0) {
			const draftAnimals = initialData.advanced && initialData.solution
				? initialData.solution
				: initialData.animals.concat(teacherBot(game.levelSize))
      return {
        ...initialGameState,
        ...initialData,
        animals: game.advanced
					? toggleTeacherBot(draftAnimals, true)
					: toggleTeacherBot(draftAnimals, false)
      }
    }

    const state = {...initialGameState, ...game, ...savedGame}
    const animals = state.animals.some(a => a.type === 'teacherBot')
			? state.animals
			: state.animals.concat(teacherBot(state.levelSize))

    return {
      ...state,
      solutionIterator: state.advanced
				? getIterator(state.solution[0].sequence, createApi(game.capabilities, state.active))
				: null,
      painted: !props.game.advanced && state.initialPainted,
      animals: state.advanced
        ? toggleTeacherBot(animals, true)
        : toggleTeacherBot(animals, false)
		}
	},

  * onCreate ({state, actions}) {
    yield actions.gameDidInitialize(state)
    yield sleep(500)
    yield actions.reset()
  },

	render ({props, state, actions, children}) {
		const {savedGame, game, gameRef, isDraft, saveRef, playlist, initialData} = props
    const docs = createDocs(game.capabilities)
    const type = game.type || 'write'

    switch (type) {
      case 'read':
        return <ReadingChallenge
          {...state}
          {...actions}
          docs={docs}
          isDraft={isDraft}
          runnerActions={actions}
          game={isDraft ? initialData : game.value}
          savedGame={savedGame.value}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist} />
      case 'write':
        return <WritingChallenge
          {...state}
          {...actions}
          docs={docs}
          gameActions={actions}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
      case 'project':
        return <WritingChallenge
          {...state}
          {...actions}
          isProject
          docs={docs}
          gameActions={actions}
          game={game.value}
          savedGame={savedGame.value}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
      default:
        return <WritingChallenge
          {...state}
          {...actions}
          game={game.value}
          docs={docs}
          savedGame={savedGame.value}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
    }
	},

	* onUpdate (prev, {props, state, actions}) {
		const {game, savedGame, draftData} = props

		if (!props.isDraft && prev.state.animals.some(({sequence}, i) => sequence !== state.animals[i].sequence)) {
			yield props.save({
				animals: state.animals
			})
		}

		if (!isEqualSequence(prev.state.animals, state.animals)) {
			yield actions.setCompleted(true)
		}

		if (state.hasRun && !prev.state.running && state.running) {
			yield actions.run()
		}
	},

  * onRemove ({props, state}) {
    if (props.updateGame && props.game.advanced) {
      yield props.updateGame({
        solution: state.animals.filter((a, i, arr) => i !== arr.length - 1)
      })
    }
  },

	controller: {
		* onComplete ({props, state, context}, data) {
			if (!props.isDraft) {
				yield props.onComplete(data)
			}
		},
		* createRunners ({actions, props, state}, animals) {
			try {
				const {game} = props
				const {active} = state

				return yield animals.map(animal => createIteratorQ(getIterator(animal.sequence, createApi(game.capabilities, active))))
			} catch (e) {
				yield actions.throwError(e)
				yield actions.onRunFinish()
			}
		},
    * throwError ({actions, context}, e) {
      const {lineNum, message} = e
      const errorLine = typeof lineNum === 'number'
        ? lineNum
        : stackTrace.parse(e.e)[0].lineNumber - 5


      yield context.openModal({
        type: 'error',
        body: `${message}. Check the code at line ${errorLine + 1}.`,
        header: 'Error'
      })
      yield actions.onRunFinish()
    },
    * onRunFinish ({actions}) {
      yield actions.setRunning(false)
      yield actions.setCompleted(true)
    },
    * runCode ({actions, state, context, props}) {
      const {
				initialPainted,
				animals,
				running,
				completed,
				hasRun,
				runners,
				pauseState
			} = state

      if (running) {
        return yield actions.setRunning(false)
      } else if (completed || !hasRun) {
        yield actions.setHasRun(false)
        yield actions.setRunning(false)
        yield sleep(50)
        const its = yield actions.createRunners(
					animals.filter(a => a.type !== 'teacherBot')
				)
        yield actions.resetBoard({
          animals: animals.map(a => ({...a, current: a.initial})),
          painted: initialPainted
        })
        yield sleep(100)
        if (its) {
          yield actions.setRunning(true)
          yield actions.setRunners(its)
          yield props.incrementAttempts()
        }
      } else {
        yield actions.setRunning(true)
      }
    },
    * run ({actions, state}) {
      const {pauseState, runners} = state
      pauseState
				? yield mapValues(({it, i, returnValue}) => actions.runBot(it, i, returnValue), pauseState)
				: yield runners.map((it, i) => actions.runBot(it, i))
    },
    * runBot ({actions, state}, it, i, returnValue) {
      const {running, animals, speed} = state

      if (!running) {
        return yield actions.setPauseState({it, i, returnValue})
      }

      const interval = getInterval(animals[i], speed)
      const args = yield actions.step(it, i, returnValue)

      if (args) {
        yield actions.incrementSteps()
        yield sleep(interval)
        yield actions.runBot(...args)
      } else {
        yield actions.onRunFinish()
      }
    },
    * runTeacherBot ({actions, state}, it, i, returnValue) {
      const interval = 100
      const args = yield actions.step(it, i, returnValue)

      if (args) {
        yield sleep(interval)
        yield actions.runTeacherBot(...args)
      } else {
        yield actions.setInitialPainted(state.painted)
        yield sleep(500)
        yield actions.removeTeacherBot()
      }
    },
    * stepForward ({props, state, actions}) {
      const {completed, hasRun, animals, pauseState, stepping, initialPainted} = state

      if (stepping) {
        return
      }

      yield actions.setStepping(true)

      if (completed || !hasRun) {
        yield actions.resetBoard({
          animals: animals.map(a => ({...a, current: a.initial})),
          painted: initialPainted
        })

        const newRunners = yield actions.createRunners(
					animals.filter(a => a.type !== 'teacherBot')
				)

        if (!newRunners) {
          return
        }

        yield actions.setHasRun(true)

        const its = yield newRunners.map((it, i) => actions.step(it, i))
        yield its.map(([it, i, returnValue]) => actions.setPauseState({it, i, returnValue}))
      } else {
        const its = yield mapValues(({it, i, returnValue}) => actions.step(it, i, returnValue), pauseState)

        if (Object.keys(its.filter(res => !!res)).length < 1) {
          yield actions.onRunFinish()
        } else {
          yield its.map(([it, i, returnValue]) => actions.setPauseState({it, i, returnValue}))
        }
      }

      yield actions.setStepping(false)
    },
    * step ({state, actions}, it, i, returnValue) {
      const {value, done} = it.next(returnValue)

      if (done) {
        return
      }

      const newReturnValue = yield actions.handleStepAction(value)
      return [it, i, newReturnValue]
    },
    * handleStepAction ({actions, state, props}, action) {
      const [lineNum, ...args] = action.payload && action.payload

      const [frame, result] = frameReducer(state, action.type, args)

      if (!checkBounds(frame.animals[frame.active].current.location, state.levelSize)) {
        yield actions.throwError({message: 'Out of bounds', lineNum: lineNum - 1})
        return result
      } else {
        yield actions.setFrame(frame)
      }

      if (!isNaN(lineNum) && lineNum >= 0) {
        yield actions.setActiveLine(lineNum)
      }

      return result
    },

    * startOver ({state}) {
      yield gameDidInitialize(state.initialData)
    },
    * reset ({state, actions, props}) {
      const {animals, advanced, initialData, randSeeds} = state

      const teacherCode = initialData.initialPainted
      const newState = {
        randSeed: getRandomSeed(randSeeds),
        animals: animals.map(animal => ({
          ...animal,
          current: animal.initial
        })),
        pauseState: undefined,
        startGrid: {},
        completed: false,
        activeLine: -1,
        running: false,
        hasRun: false,
        painted: advanced ? {} : initialData.initialPainted,
        runners: {},
        paints: 0,
        steps: 0
      }

      yield actions.resetBoard(newState)

      if (advanced) {
        const base = {...state, painted: {}}
        yield actions.addTeacherBot()
        yield sleep(500)
        const startCode = getIterator(teacherCode, animalApis['teacherBot'].default(animals.length - 1))
				const it = createIterator(startCode)
        yield actions.runTeacherBot(it, animals.length - 1)
      }
    }
  },

  reducer: {
    resetBoard: (state, initState) => ({
      ...initState,
      pauseState: null,
      steps: 0,
      completed: false,
      hasRun: false
    }),
    addTeacherBot: (state) => ({
      animals: state.animals.map(a => {
        return a.type === 'teacherBot'
					? {...a, hidden: false, current: a.initial}
					: {...a, hidden: true}
      })
    }),
    removeTeacherBot: (state) => ({
      animals: state.animals.map(a => {
        return a.type === 'teacherBot'
					? {...a, hidden: true}
					: {...a, hidden: false}
      })
    }),
    setFrame: (state, frame) => frame,
    setInitialPainted: (state, initialPainted) => ({initialPainted, startGrid: initialPainted}),
    setSequence: ({animals, active}, sequence) => ({
      animals: updateAnimal(animals, 'sequence', active, sequence)
    }),
    gameDidInitialize: (state, game) => ({
      initialData: game,
      ...game
    }),
		setPainted: (state, grid, coord, color) => ({
			[grid]: {...state[grid], [coord]: color}
		}),
    animalMove: setAnimalPos,
    setRandSeeds: (state, randSeeds) => ({randSeeds}),
    setSolutionChecker: (state, solutionChecker) => ({solutionChecker}),
    setCompleted: (state, completed) => ({completed}),
    setLocalDescription: (state, description) => ({description}),
    incrementSteps: (state) => ({steps: state.steps + 1}),
    setRunners: (state, runners) => ({runners, hasRun: true}),
    setPauseState: (state, payload) => setProp(`pauseState.${payload.i}`, state, {...payload}),
    setActive: (state, {id}) => ({active: id}),
    setSpeed: (state, speed) => ({
      speed: Math.max(0.25, Math.min(speed, 16))
    }),
    setStepping: (state, stepping) => ({stepping}),
    setHasRun: (state, hasRun) => ({hasRun}),
    setRunning: (state, running) => ({running, hasRun: true}),
    setActiveLine: (state, activeLine) => ({activeLine})
  }
})

function getRandomSeed (seeds) {
  if (!seeds || seeds.length === 0) return undefined
  return seeds[Math.floor(Math.random() * seeds.length - 1)]
}
