/**
 * Imports
 */

import {
	setAnimalPos, animalPaint, animalTurn, computeLocation, createIteratorQ,
	checkBounds, isEqualSequence, updateAnimal, createFrames
} from 'utils/frameReducer'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import initialGameState from 'utils/initialGameState'
import {getInterval} from 'utils/animal'
import {component, element} from 'vdux'
import isIterator from '@f/is-iterator'
import mapValues from '@f/map-values'
import stackTrace from 'stack-trace'
import setProp from '@f/set-prop'
import sleep from '@f/sleep'

/**
 * <Game/>
 */

export default component({
	initialState ({props}) {
		const {game, savedGame, initialData = {}} = props

		if (Object.keys(initialData).length > 0) {
			return {...initialGameState, ...initialData}
		}

		return {
			...initialGameState,
			...game,
			...savedGame
		}
	},

	* onCreate ({state, actions}) {
		yield actions.gameDidInitialize(state)
	},

	render ({props, state, actions, children}) {
		const {savedGame, game, gameRef, isDraft, saveRef, playlist, initialData} = props

		return (
			game && game.type === 'read'
				?	<ReadingChallenge
						{...actions}
						{...state}
						isDraft={isDraft}
						game={isDraft ? initialData : game}
						gameActions={actions}
						savedGame={savedGame}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}/>
				: <WritingChallenge
						{...actions}
						{...state}
						isDraft={isDraft}
						game={isDraft ? initialData : game}
						gameActions={actions}
						savedGame={savedGame}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}>
						{children}
					</WritingChallenge>
		)
	},

	* onUpdate (prev, {props, state, actions}) {
		const {game, savedGame, draftData} = props

		if (!props.isDraft && prev.state.animals.some(({sequence}, i) => sequence !== state.animals[i].sequence)) {
			yield props.save()
		}

		if (!isEqualSequence(prev.state.animals, state.animals)) {
			yield actions.setCompleted(true)
		}

		// if (!prev.props.hasRun && props.hasRun) {
		// 	yield props.run()
		// }

		if (state.hasRun && !prev.state.running && state.running) {
			yield actions.run()
		}
	},

	controller: {
		* onComplete ({props, state, context}, data) {
			if (!props.isDraft) {
				yield props.onComplete(data)
			}
		},
		* createRunners ({actions}, animals) {
			try {
				return yield animals.map(createIteratorQ)
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
			const {animals, running, completed, hasRun, runners, pauseState} = state

			yield actions.setRunning(true)

			if (running) {
				return yield actions.setRunning(false)
			} else if (completed || !hasRun) {
				yield actions.reset()
				yield sleep(50)
				yield actions.setRunning(true)

				const its = yield actions.createRunners(animals)

				if (its) {
					yield actions.setRunners(its)
					yield props.incrementAttempts()
				}
			}
		},
		* run ({actions, state}) {
			const {pauseState, runners} = state

			pauseState
				? yield mapValues(({it, i, onComplete, returnValue}) => actions.runBot(it, i, onComplete, returnValue), pauseState)
				: yield runners.map((it, i) => actions.runBot(it, i))
		},
		* runBot ({actions, state}, it, i, onComplete, returnValue) {
			const {running, animals, speed} = state

			if (!running) {
				return yield actions.setPauseState({it, i, onComplete, returnValue})
			}

			const interval = getInterval(animals[i], speed)
			const args = yield actions.step(it, i, onComplete, returnValue)

			if (args) {
				yield sleep(interval)
				yield actions.runBot(...args)
			} else {
				yield actions.onRunFinish()
			}
		},
		* stepForward ({props, state, actions}) {
			const {completed, hasRun, animals, pauseState, stepping} = state

			if (stepping) {
				return
			}

			yield actions.setStepping(true)

			if (completed || !hasRun) {
				yield actions.reset()
				const newRunners = yield actions.createRunners(animals)

				if (!newRunners) {
					return
				}

				yield actions.setHasRun(true)

				const its = yield newRunners.map((it, i) => actions.step(it, i))
				yield its.map(([it, i, onComplete, returnValue]) => actions.setPauseState({it, i, onComplete, returnValue}))
			} else {
				const its = yield mapValues(({it, i, onComplete, returnValue}) => actions.step(it, i, onComplete, returnValue), pauseState)

				if (Object.keys(its.filter(res => !!res)).length < 1) {
					yield actions.onRunFinish()
				} else {
					yield its.map(([it, i, onComplete, returnValue]) => actions.setPauseState({it, i, onComplete, returnValue}))
				}
			}

			yield actions.setStepping(false)
		},
		* step ({state, actions}, it, i, outerIt, returnValue) {
			const {animals, running, speed} = state
			const {value, done} = it.next(returnValue)

			if (done) {
				return outerIt
					? yield actions.step(outerIt, i)
					: false
			}

			if (isIterator(value)) {
				return yield actions.step(value, i, it, returnValue)
			} else if (isIterator(value.payload)) {
				return yield actions.step(value.payload, i, it, returnValue)
			} else {
				const newReturnValue = yield actions.handleStepAction(value)
				return [it, i, outerIt, newReturnValue]
			}
		},
		* handleStepAction ({actions}, action) {
			const lineNum = action.payload && action.payload.lineNum

	    if (!isNaN(lineNum) && lineNum >= 0) {
	      yield actions.setActiveLine(lineNum)
	    }

	    yield actions.incrementSteps()
	    return yield actions[action.type](...action.payload)
		},

		* animalMove ({state, actions}, id, getLocation, lineNum) {
			const {animals, levelSize} = state
			const location = computeLocation(state, id, getLocation)

			const val = checkBounds(location, levelSize)
				? actions.setAnimalPos(id, location)
				: actions.throwError({message: 'Out of bounds', lineNum: lineNum - 1})

			yield val
		},

		* getCurrentColor ({state}, fn) {
			// XXX Total hack, need a better way to do this
			fn(state.painted[state.animals[state.active].current.location])
		},
		* startOver ({state}) {
			yield gameDidInitialize(state.initialData)
		}
	},

	reducer: {
		reset: state => ({
			activeLine: -1,
			steps: 0,
			paints: 0,
			painted: generatePainted(state),
			hasRun: false,
			runners: {},
			running: false,
			pauseState: undefined,
			completed: false,
			animals: state.animals.map(animal => ({...animal, current: animal.initial}))
		}),
		setSequence: ({animals, active}, sequence) => ({
			animals: updateAnimal(animals, 'sequence', active, sequence)
		}),
  	gameDidInitialize: (state, game) => ({
  		initialData: game,
  		...game,
  		painted: generatePainted(state) || {}
  	}),
		animalPaint,
		setAnimalPos,
		animalTurn,
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
		setRunning: (state, running) => ({running}),
		setActiveLine: (state, activeLine) => ({activeLine})
	}
})

function getLastFrame (state, sequence) {
	const frames = createFrames({
		...state,
		animals: [{
			current: {
				rot: 0,
				location: [state.levelSize[0] - 1, 0]
			},
			sequence,
			type: 'zebra'
		}]
	}, state.active)
	return frames ? frames[frames.length - 1].painted : {}
}

function generatePainted (state) {
	const {initialPainted, active} = state
	return typeof initialPainted === 'object'
		? initialPainted
		: getLastFrame(state, initialPainted)
}
