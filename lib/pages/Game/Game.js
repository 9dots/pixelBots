/**
 * Imports
 */

import frameReducer, {
  createIteratorQ, checkBounds, isEqualSequence, updateAnimal,
  createIterator, getIterator, setAnimalPos, turn, getLastFrame
} from 'utils/frameReducer'
import createApi, {teacherBot, createDocs} from 'animalApis'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import {getInterval, resetAnimalPos} from 'utils/animal'
import initialGameState from 'utils/initialGameState'
import linesOfCode from 'utils/linesOfCode'
import BotModal from 'components/BotModal'
import {component, element} from 'vdux'
import isIterator from '@f/is-iterator'
import mapValues from '@f/map-values'
import stackTrace from 'stack-trace'
import diffKeys from '@f/diff-keys'
import setProp from '@f/set-prop'
import filter from '@f/filter'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'
import srand from '@f/srand'
import marked from 'marked'
import omit from '@f/omit'
import map from '@f/map'

/**
 * <Game/>
 */

function addTeacherBot (levelSize) {
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
	initialState: ({props}) => ({
		ready: false,
    docs: createDocs(props.game.capabilities, props.game.palette)
	}),

  * onCreate ({state, actions, context, props}) {
		const {game, savedGame = {}, initialData = {}} = props
		if (Object.keys(initialData).length > 0) {
			const draftAnimals = initialData.advanced && initialData.solution
				? initialData.solution.concat(addTeacherBot(game.levelSize))
				: initialData.animals.map(a => resetAnimalPos(a, game.levelSize[0], a.initial.location)).concat(addTeacherBot(game.levelSize))
			return yield actions.gameDidInitialize({
				...initialGameState,
				...initialData,
        ...initialData.meta,
        painted: !initialData.advanced && initialData.initialPainted,
				rand: srand(getRandomSeed()),
        lloc: linesOfCode(initialData.animals[0].sequence),
				ready: true,
				active: 0,
				animals: initialData.advanced
					? toggleTeacherBot(draftAnimals, true)
					: toggleTeacherBot(draftAnimals, false)
			})
		}

		const gameState = {...initialGameState, ...game, ...savedGame}
		const animals = gameState.animals.some(a => a.type === 'teacherBot')
			? gameState.animals
			: gameState.animals.concat(addTeacherBot(gameState.levelSize))

		if (gameState.advanced && !gameState.solution) {
			return yield context.setUrl('/')
		}

    if (game.showModal) {
      yield context.openModal(() => <BotModal body={<Block minHeight={100} py='l' innerHTML={marked(game.description)} />} />)
    }

		return yield actions.gameDidInitialize({
			...gameState,
      ...gameState.meta,
			solutionIterator: gameState.advanced
				? getIterator(gameState.solution[0].sequence, createApi(game.capabilities, state.active, game.palette))
				: null,
			painted: !props.game.advanced && gameState.initialPainted,
			rand: srand(getRandomSeed()),
      lloc: linesOfCode(gameState.animals[0].sequence),
			ready: true,
			animals: gameState.advanced
				? toggleTeacherBot(animals, true)
				: toggleTeacherBot(animals, false)
		})
  },

  render ({props, state, actions, context, children}) {
    const {savedGame = {}, game, gameRef, isDraft, saveRef, playlist, initialData, saved, userProfile, incrementAttempts, incrementSlowdowns, next} = props
		const type = game.type || 'write'
    const {isAnonymous} = context
		const {ready, docs, running, speed} = state
    const userAnimal = isAnonymous ? 'penguin' : userProfile.bot

		if (!ready) {
			return <span/>
		}

		const passedState = running && speed > 8
			? omit(['steps', 'activeLine', 'paints', 'painted'], state)
			: omit(['paints'], state)

    switch (type) {
      case 'read':
        return <ReadingChallenge
          {...state}
          {...actions}
          next={next}
          incrementTimeElapsed={props.incrementTimeElapsed}
          docs={docs}
          saved={saved}
          isDraft={isDraft}
          runnerActions={actions}
          game={isDraft ? initialData : game}
          savedGame={savedGame}
          userAnimal={userAnimal}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist} />
      case 'write':
        return <WritingChallenge
          {...passedState}
          {...actions}
          docs={docs}
          saved={saved}
          gameActions={actions}
          savedGame={savedGame}
          gameRef={gameRef}
          userAnimal={userAnimal}
          saveRef={saveRef}
          next={next}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
      case 'project':
        return <WritingChallenge
          {...passedState}
          {...actions}
          saved={saved}
          isProject
          docs={docs}
          gameActions={actions}
          game={game.value}
          savedGame={savedGame}
          userAnimal={userAnimal}
          gameRef={gameRef}
          saveRef={saveRef}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
      default:
        return <WritingChallenge
          {...passedState}
          {...actions}
          next={next}
          docs={docs}
          saved={saved}
          savedGame={savedGame}
          gameActions={actions}
          gameRef={gameRef}
          userAnimal={userAnimal}
          saveRef={saveRef}
          playlist={playlist}
          isDraft={isDraft}
          draftData={initialData} />
    }
	},

  * onUpdate (prev, {props, state, actions}) {
		if (!state.ready) return

		if (prev.state.ready !== state.ready) {
			yield actions.reset()
		}

    if(prev.state.speed > state.speed) {
      yield props.incrementSlowdowns()
    }

    if (prev.state.animals && prev.state.animals.some(({sequence}, i) => sequence !== state.animals[i].sequence)) {
      const lloc = linesOfCode(state.animals[0].sequence)
      if (!props.isDraft) {
        yield props.setSaved(false)
        yield props.save({
          animals: state.animals,
          'meta/loc': lloc,
          'meta/modifications': state.modifications
        })
      }
      yield actions.setLloc(lloc)
      if (props.updateGame && props.game.advanced) {
        yield props.updateGame({
          solution: state.animals.slice(0, -1)
        })
      }
    }

    if (prev.state.targetPainted !== state.targetPainted && !props.isDraft) {
      yield props.save({targetPainted: state.targetPainted})
    }

    if (prev.state.animals && !isEqualSequence(prev.state.animals, state.animals)) {
      yield actions.setCompleted(true)
    }

		if (state.hasRun && !prev.state.running && state.running) {
			yield actions.run()
		}

		if (prev.state.targetPainted && prev.state.targetPainted !== state.targetPainted) {
			const newKeys = diffKeys(prev.state.targetPainted, state.targetPainted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.targetCanvas.updateShapeColor(place, state.targetPainted[key] || 'white')
        if(state.miniTargetCanvas) { 
          state.miniTargetCanvas.updateShapeColor(place, state.targetPainted[key] || 'white')
        }
      })
		}

		if (state.solutionCanvas && prev.state.painted !== state.painted) {
			const newKeys = diffKeys(prev.state.painted, state.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.solutionCanvas.updateShapeColor(place, state.painted[key] || 'white')
      })
		}
	},

  * onRemove ({props, state}) {
    if (props.updateGame && props.game.advanced) {
      yield props.updateGame({
        solution: state.animals.slice(0, -1)
      })
    }
  },

	controller: {
		* onComplete ({props, state, context}, data) {
			if (!props.isDraft) {
				yield props.onComplete(data)
			} else {
        yield context.closeModal()
      }
		},
		* createRunners ({actions, props, state}, animals) {
			try {
				const {game} = props
				const {active} = state

				return yield animals.map(animal => createIteratorQ(getIterator(animal.sequence, createApi(game.capabilities, active, game.palette))))
			} catch (e) {
				yield actions.throwError(e)
				yield actions.onRunFinish()
			}
		},
    * throwError ({actions, context}, e) {
      const {lineNum, message} = e
      const errorLine = typeof lineNum === 'number'
        ? lineNum
        : stackTrace.parse(e.e ? e.e : e)[0].lineNumber - 5

      yield context.openModal({
        type: 'error',
        body: `${e.message}. Check the code at line ${errorLine + 1}.`,
        header: 'Error'
      })
      yield actions.onRunFinish()
    },
    * onRunFinish ({actions}) {
      yield actions.setRunning(false)
      yield actions.setCompleted(true)
    },
    * runCode ({actions, state, context, props}, type) {
      const {initialPainted, animals, running, completed, hasRun, rand} = state

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
        yield sleep(500)
        yield actions.revealTogglePaints()
        if (its) {
          yield actions.setRunning(true)
          yield actions.setRunners(its)
          yield props.incrementRuns()
        }
      } else {
        yield actions.setRunning(true)
      }
    },
    * run ({actions, state}) {
      const {pauseState, runners} = state
      yield sleep(100)
      pauseState
				? yield mapValues(({it, i, returnValue}) => actions.runBot(it, i, returnValue), pauseState)
				: yield runners.map((it, i) => actions.runBot(it, i))
    },
    * runTeacherBot ({actions, state}, it, i, returnValue) {
      const interval = getInterval(null, state.speed)
      const args = yield actions.step(it, i, returnValue)

      if (args) {
        yield sleep(interval)
        yield actions.runTeacherBot(...args)
      } else {
        yield sleep(500)
        yield actions.removeTeacherBot()
        yield sleep(100)
        yield actions.animalMove(
          state.animals.length - 1,
          state.animals[state.animals.length - 1].initial.location
        )
      }
    },
    * stepForward ({props, state, actions}) {
      const {hasRun, animals, pauseState, stepping, initialPainted} = state

      if (stepping) {
        return
      }

      yield props.incrementStepperSteps()
      yield actions.setStepping(true)

      if (!hasRun) {
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

        const its = yield newRunners.map((it, i) => actions.step(it, i))
        yield its.map(([it, i, returnValue]) => actions.setPauseState({it, i, returnValue}))
        yield actions.setHasRun(true)
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
    * runBot ({actions, state}, it, i, returnValue) {
      const {running, animals, speed} = state
      if (!running) {
        return yield actions.setPauseState({it, i, returnValue})
      }

      const interval = getInterval(null, state.speed)
      const args = yield actions.step(it, i, returnValue)

      if (args) {
        if (state.speed <= 50 || state.steps % (Math.floor((state.speed - 50) / 7) || 1) === 0) {
          yield sleep(interval)
        }
        yield actions.runBot(...args)
      } else {
        yield actions.onRunFinish()
      }
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
      const {animals} = state
      const [lineNum, ...args] = action.payload && action.payload
      const teacherBotRunning = animals.some(a => {
        return a.type === 'teacherBot' && a.hidden === false
      })

      if (action.type === 'throwError') {
        yield actions.throwError(...action.payload)
        return
      }

      const [frame, result] = frameReducer({...state, active: teacherBotRunning ? animals.length - 1 : state.active}, action.type, args)

      if (!checkBounds(frame.animals[frame.active].current.location, state.levelSize)) {
        yield actions.throwError({message: 'Out of bounds', lineNum: lineNum - 1})
        return result
      } else {
        yield actions.setFrame({...frame, active: state.active, activeLine: lineNum})
      }

      // if (!isNaN(lineNum) && lineNum >= 0 && state.speed < 15) {
      // 	yield actions.updateProgramState(lineNum)
      // }

      return result
    },

    * loopHandler (action) {

    },

    * startOver ({state, actions, props}) {
      yield actions.gameDidInitialize({
        ...state.initialData,
        animals: props.game.animals.map((a, i) => ({
          ...a,
          sequence: state.startCode || a.sequence
        }))
      })
    },
    * reset ({state, actions, props}) {
      const {animals, advanced, initialData, randSeeds, targetPainted} = state
      const teacherCode = initialData.initialPainted
      const newState = {
				rand: srand(getRandomSeed(randSeeds)),
        animals: animals.map(animal => ({
          ...animal,
          current: animal.initial
        })),
        pauseState: undefined,
				completed: false,
        activeLine: -1,
        running: false,
        loops: {},
				startGrid: {},
        hasRun: false,
        painted: advanced ? {} : initialData.initialPainted,
        targetPainted: advanced ? {} : targetPainted,
        runners: {},
        steps: 0
      }

      yield actions.resetBoard(newState)

      if (advanced && typeof teacherCode === 'string') {
        yield actions.addTeacherBot()
        yield sleep(500)
        const startCode = getIterator(
          teacherCode,
          createApi(teacherBot, animals.length - 1)
        )
        const it = createIterator(startCode)
        yield actions.runTeacherBot(it, animals.length - 1)
        yield actions.getAdvancedPainted()
      }
    },
    * runCheck ({actions, state}) {
      const {animals, active, capabilities, palette, rand, initialPainted} = state
      yield sleep(1000)
      yield actions.revealTogglePaints()
      const startCode = getIterator(
        animals[active].sequence,
        createApi(capabilities, animals.length - 1, palette)
      )
      const it = createIterator(startCode)
      yield actions.runTeacherBot(it, animals.length - 1)
    },
    * revealTogglePaints ({state, actions}) {
      const {initialData, rand, speed} = state
      const togglePaints = filter(val => val === 'toggle', initialData.initialPainted)
      for (let loc in togglePaints) {
        const color = rand(2, 0) > 1 ? 'blue' : 'yellow'
        yield actions.setPainted('painted', loc, color)
        yield sleep(1000 / speed)
      }
    },
    * getAdvancedPainted ({state, actions}) {
      const {solution, capabilities, palette} = state
      if (solution) {
        yield actions.setTargetPainted(getLastFrame(
          state,
          getIterator(solution[0].sequence, createApi(capabilities, 0, palette))
        ))
      }
    }
  },

  reducer: {
    resetBoard: (state, initState) => ({
      ...initState,
      pauseState: null,
      steps: 0,
      completed: false,
      hasRun: false,
      activeLine: -1
    }),
    addTeacherBot: (state) => ({
      animals: state.animals.map(a => {
        return a.type === 'teacherBot'
					? {...a, hidden: false}
					: {...a, hidden: true}
      })
    }),
    removeTeacherBot: (state) => ({
      activeLine: -1,
      animals: state.animals.map(a => {
        return a.type === 'teacherBot'
					? {...a, hidden: true}
					: {...a, hidden: false}
      })
    }),
    setTargetPainted: (state, targetPainted) => ({targetPainted}),
    setFrame: (state, frame) => ({...frame, steps: state.steps + 1}),
    setInitialPainted: (state, initialPainted) => ({initialPainted, startGrid: initialPainted, log: console.log('initialPainted', initialPainted)}),
    setSequence: ({animals, active}, sequence, modifications) => ({
      animals: updateAnimal(animals, 'sequence', active, sequence),
      modifications
    }),
    gameDidInitialize: (state, game) => ({
			...game,
      initialData: game
    }),
    setPainted: (state, grid, coord, color) => ({
      [grid]: {...state[grid], [coord]: color},
    }),
    animalMove: setAnimalPos,
    animalTurn: turn,
    updateProgramState: (state, activeLine) => ({activeLine, steps: state.steps + 1}),
    setRandSeeds: (state, randSeeds) => ({randSeeds}),
    setSolutionChecker: (state, solutionChecker) => ({solutionChecker}),
    setCompleted: (state, completed) => ({completed}),
    setLocalDescription: (state, description) => ({description}),
    incrementSteps: (state) => ({steps: state.steps + 1}),
    setRunners: (state, runners) => ({runners, hasRun: true}),
    setPauseState: (state, payload) => setProp(`pauseState.${payload.i}`, state, {...payload}),
    setActive: (state, {id}) => ({active: id}),
    setCanvasContext: (state, canvas, name) => ({[`${name}Canvas`]: canvas}),
    setSpeed: (state, speed) => ({
      speed: Math.pow(1.6, speed),
    }),
    setLloc: (state, lloc) => ({lloc}),
    setReady: () => ({ready: true}),
    setStepping: (state, stepping) => ({stepping}),
    setHasRun: (state, hasRun) => ({hasRun}),
    setRunning: (state, running) => ({running, hasRun: true})
  }
})

function getRandomSeed (seeds) {
  if (!seeds || seeds.length === 0) return Math.random() * 1000

  return seeds[Math.floor(Math.random() * seeds.length)]
}
