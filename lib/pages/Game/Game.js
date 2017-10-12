/**
 * Imports
 */

import frameReducer, {
  createIteratorQ,
  checkBounds,
  isEqualSequence,
  updateAnimal,
  createIterator,
  getIterator,
  setAnimalPos,
  turn,
  getLastFrame
} from 'utils/frameReducer'
import createApi, { teacherBot, createDocs } from 'animalApis'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import { getInterval, resetAnimalPos } from 'utils/animal'
import initialGameState from 'utils/initialGameState'
import linesOfCode from 'utils/linesOfCode'
import BotModal from 'components/BotModal'
import { component, element } from 'vdux'
import mapValues from '@f/map-values'
import stackTrace from 'stack-trace'
import diffKeys from '@f/diff-keys'
import setProp from '@f/set-prop'
import filter from '@f/filter'
import { Block } from 'vdux-ui'
import sleep from '@f/sleep'
import srand from '@f/srand'
import marked from 'marked'
import omit from '@f/omit'

/**
 * <Game/>
 */
function addTeacherBot (animals) {
  return { ...animals[0], type: 'teacherBot', hidden: false }
}

function toggleTeacherBot (animals, toggle) {
  return animals.map(a => {
    return a.type !== 'teacherBot'
      ? { ...a, hidden: toggle }
      : { ...a, hidden: !toggle }
  })
}

export default component({
  initialState: ({ props }) => ({
    ready: false,
    docs: createDocs(props.game.capabilities, props.game.palette)
  }),
  * onCreate ({ state, actions, context, props }) {
    const { game, savedGame = {}, initialData = {} } = props
    if (Object.keys(initialData).length > 0) {
      const draftAnimals =
        initialData.advanced && initialData.solution
          ? initialData.solution.concat(addTeacherBot(game.animals))
          : initialData.animals
            .map(a =>
              resetAnimalPos(a, game.levelSize[0], a.initial.location)
            )
            .concat(addTeacherBot(game.animals))
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

    const gameState = { ...initialGameState, ...game, ...savedGame }

    if (gameState.advanced && !gameState.solution) {
      return yield context.setUrl('/')
    }

    if (game.showModal) {
      yield context.openModal(() => (
        <BotModal
          confirm={context.closeModal}
          confirmText='Start'
          body={
            <Block
              textAlign='center'
              innerHTML={marked(game.description)}
              minHeight={100}
              py='l' />
          } />
      ))
    }

    return yield actions.gameDidInitialize({
      ...gameState,
      ...gameState.meta,
      solutionIterator: gameState.advanced
        ? getIterator(
          gameState.solution[0].sequence,
          createApi(game.capabilities, state.active, game.palette)
        )
        : null,
      painted: !props.game.advanced && gameState.initialPainted,
      rand: srand(getRandomSeed()),
      lloc: linesOfCode(gameState.animals[0].sequence),
      ready: true,
      animals: gameState.advanced
        ? toggleTeacherBot(gameState.animals, true)
        : toggleTeacherBot(gameState.animals, false)
    })
  },
  render ({ props, state, actions, context, children }) {
    const {
      savedGame = {},
      game,
      gameRef,
      isDraft,
      saveRef,
      playlist,
      initialData,
      saved,
      userProfile,
      next
    } = props
    const type = game.type || 'write'
    const { isAnonymous } = context
    const { ready, docs, running, speed } = state
    const userAnimal = isAnonymous ? 'penguin' : userProfile.bot
    const gameHeight = '505px'

    if (!ready) {
      return <span />
    }

    const passedState =
      running && speed > 8
        ? omit(['steps', 'activeLine', 'paints', 'painted'], state)
        : omit(['paints'], state)

    switch (type) {
      case 'read':
        return (
          <ReadingChallenge
            {...state}
            {...actions}
            gameHeight={gameHeight}
            next={next}
            incrementTimeElapsed={props.incrementTimeElapsed}
            game={isDraft ? initialData : game}
            runnerActions={actions}
            userAnimal={userAnimal}
            savedGame={savedGame}
            playlist={playlist}
            isDraft={isDraft}
            gameRef={gameRef}
            saveRef={saveRef}
            saved={saved}
            docs={docs} />
        )
      case 'write':
        return (
          <WritingChallenge
            {...passedState}
            {...actions}
            userAnimal={userAnimal}
            draftData={initialData}
            gameHeight={gameHeight}
            docs={docs}
            saved={saved}
            gameActions={actions}
            savedGame={savedGame}
            playlist={playlist}
            gameRef={gameRef}
            saveRef={saveRef}
            isDraft={isDraft}
            next={next} />
        )
      case 'project':
        return (
          <WritingChallenge
            {...passedState}
            {...actions}
            draftData={initialData}
            userAnimal={userAnimal}
            gameHeight={gameHeight}
            saved={saved}
            isProject
            docs={docs}
            gameActions={actions}
            savedGame={savedGame}
            playlist={playlist}
            game={game.value}
            gameRef={gameRef}
            saveRef={saveRef}
            isDraft={isDraft} />
        )
      default:
        return (
          <WritingChallenge
            {...passedState}
            {...actions}
            draftData={initialData}
            userAnimal={userAnimal}
            gameHeight={gameHeight}
            next={next}
            docs={docs}
            saved={saved}
            savedGame={savedGame}
            gameActions={actions}
            playlist={playlist}
            gameRef={gameRef}
            saveRef={saveRef}
            isDraft={isDraft} />
        )
    }
  },
  * onUpdate (prev, { props, state, actions }) {
    if (!state.ready) return

    if (prev.state.ready !== state.ready) {
      yield actions.reset()
    }

    if (prev.state.speed > state.speed) {
      yield props.incrementSlowdowns()
    }

    if (
      prev.state.targetPainted !== state.targetPainted &&
      state.type === 'project' &&
      !props.isDraft
    ) {
      yield props.save({ targetPainted: state.targetPainted })
    }

    if (
      prev.state.animals &&
      !isEqualSequence(prev.state.animals, state.animals)
    ) {
      yield actions.setEditorIsDirty(true)
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
        yield props.updateGame({ solution: state.animals.slice(0, -1) })
      }
    }

    if (state.hasRun && !prev.state.running && state.running) {
      yield actions.run()
    }

    if (
      prev.state.targetPainted &&
      prev.state.targetPainted !== state.targetPainted
    ) {
      const newKeys = diffKeys(prev.state.targetPainted, state.targetPainted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.targetCanvas.updateShapeColor(
          place,
          state.targetPainted[key] || 'white'
        )
        if (state.miniTargetCanvas) {
          state.miniTargetCanvas.updateShapeColor(
            place,
            state.targetPainted[key] || 'white'
          )
        }
      })
    }

    if (state.solutionCanvas && prev.state.painted !== state.painted) {
      const newKeys = diffKeys(prev.state.painted, state.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        state.solutionCanvas.updateShapeColor(
          place,
          state.painted[key] || 'white'
        )
      })
    }
  },
  * onRemove ({ props, state }) {
    if (props.updateGame && props.game.advanced) {
      yield props.updateGame({ solution: state.animals.slice(0, -1) })
    }
  },
  controller: {
    * onComplete ({ props, state, context }, data) {
      if (!props.isDraft) {
        yield props.onComplete(data)
      } else {
        yield context.closeModal()
      }
    },
    * createRunners ({ actions, props, state }, animals) {
      try {
        const { game } = props
        const { active } = state

        return yield animals.map(animal =>
          createIteratorQ(
            getIterator(
              animal.sequence,
              createApi(game.capabilities, active, game.palette)
            )
          )
        )
      } catch (e) {
        yield actions.throwError(e)
        yield actions.onRunFinish()
      }
    },
    * throwError ({ actions, context }, e) {
      const { lineNum } = e
      const errorLine =
        typeof lineNum === 'number'
          ? lineNum
          : stackTrace.parse(e.e ? e.e : e)[0].lineNumber - 5

      yield context.openModal({
        type: 'error',
        body: `${e.message}. Check the code at line ${errorLine + 1}.`,
        header: 'Error'
      })
      yield actions.setTeacherRunning(false)
      yield actions.removeTeacherBot()
      yield actions.onRunFinish()
    },
    * onRunFinish ({ actions }) {
      yield actions.setRunning(false)
      yield actions.setCompleted(true)
    },
    * runCode ({ actions, state, context, props }, type) {
      const {
        advanced,
        initialPainted,
        animals,
        running,
        completed,
        hasRun,
        editorIsDirty,
        painted
      } = state

      if (running) {
        return yield actions.setRunning(false)
      } else if (editorIsDirty || completed || !hasRun) {
        yield actions.setHasRun(false)
        yield actions.setRunning(false)
        yield sleep(50)
        const its = yield actions.createRunners(
          animals.filter(a => a.type !== 'teacherBot')
        )
        yield actions.reset({
          animals: animals.map(a => ({ ...a, current: a.initial })),
          painted: advanced ? painted : initialPainted
        })
        yield actions.revealTogglePaints()
        yield actions.setRunners(its)
        yield sleep(500)
        if (its) {
          yield actions.setRunning(true)
          yield props.incrementRuns()
        }
      } else {
        yield actions.setRunning(true)
      }
    },
    * run ({ actions, state }) {
      const { pauseState, runners } = state
      yield sleep(100)
      pauseState
        ? yield mapValues(
          ({ it, i, returnValue }) => actions.runBot(it, i, returnValue),
          pauseState
        )
        : yield runners.map((it, i) => actions.runBot(it, i))
    },
    * runTeacherBot ({ actions, state }, it, i, returnValue) {
      const interval = getInterval(null, state.speed)
      const args = yield actions.step(it, i, returnValue)
      if (args && state.teacherRunning) {
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
        if (!state.teacherRunning) {
          throw new Error('uh oh')
        }
      }
    },
    * stepForward ({ props, state, actions }) {
      const {
        hasRun,
        animals,
        pauseState,
        stepping,
        initialPainted,
        editorIsDirty
      } = state

      if (stepping) {
        return
      }

      yield props.incrementStepperSteps()
      yield actions.setStepping(true)

      if (!hasRun || editorIsDirty) {
        yield actions.resetBoard({
          animals: animals.map(a => ({ ...a, current: a.initial })),
          painted: initialPainted
        })

        const newRunners = yield actions.createRunners(
          animals.filter(a => a.type !== 'teacherBot')
        )
        if (!newRunners) {
          return
        }
        yield actions.revealTogglePaints()
        const its = yield newRunners.map(actions.step)
        yield its.map(([it, i, returnValue]) =>
          actions.setPauseState({ it, i, returnValue })
        )
        yield actions.setHasRun(true)
      } else {
        const its = yield mapValues(
          ({ it, i, returnValue }) => actions.step(it, i, returnValue),
          pauseState
        )
        if (Object.keys(its.filter(res => !!res)).length < 1) {
          yield actions.onRunFinish()
        } else {
          yield its.map(([it, i, returnValue]) =>
            actions.setPauseState({ it, i, returnValue })
          )
        }
      }

      yield actions.setStepping(false)
    },
    * runBot ({ actions, state }, it, i, returnValue) {
      const { running } = state
      if (!running) {
        return yield actions.setPauseState({ it, i, returnValue })
      }

      const interval = getInterval(null, state.speed)
      const args = yield actions.step(it, i, returnValue)

      if (args) {
        if (
          state.speed <= 50 ||
          state.steps % (Math.floor((state.speed - 50) / 7) || 1) === 0
        ) {
          yield sleep(interval)
        }
        yield actions.runBot(...args)
      } else {
        yield actions.onRunFinish()
      }
    },
    * step ({ state, actions }, it, i, returnValue) {
      const { value, done } = it.next(returnValue)

      if (done) {
        return
      }

      const newReturnValue = yield actions.handleStepAction(value)
      return [it, i, newReturnValue]
    },
    * handleStepAction ({ actions, state, props }, action) {
      const { animals, levelSize, teacherRunning } = state
      const [lineNum, ...args] = action.payload && action.payload

      if (action.type === 'throwError') {
        yield actions.throwError(...action.payload)
        return
      }

      const [frame, result] = frameReducer(
        {
          ...state,
          active: teacherRunning ? animals.length - 1 : state.active
        },
        action.type,
        args
      )

      const currentLocation = frame.animals[frame.active].current.location

      if (!checkBounds(currentLocation, levelSize)) {
        yield actions.throwError({
          message: 'Out of bounds',
          lineNum: lineNum - 1
        })
      } else {
        yield actions.setFrame({
          ...frame,
          active: state.active,
          activeLine: lineNum
        })
      }

      return result
    },
    * startOver ({ state, actions, props }) {
      yield actions.gameDidInitialize({
        ...state.initialData,
        modifications: 0,
        animals: props.game.animals.map((a, i) => ({
          ...a,
          sequence: state.startCode || a.sequence
        }))
      })
    },
    * reset ({ state, actions, props }) {
      const { animals, advanced, initialData, randSeeds, targetPainted } = state
      const teacherCode = initialData.initialPainted
      const newState = {
        rand: srand(getRandomSeed(randSeeds)),
        animals: animals.map(animal => ({
          ...animal,
          current: animals[0].initial
        })),
        pauseState: undefined,
        teacherRunning: false,
        completed: false,
        editorIsDirty: false,
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
        yield actions.setTeacherRunning(true)
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
    * runCheck ({ actions, state }) {
      const { animals, active, capabilities, palette } = state
      yield sleep(1000)
      yield actions.revealTogglePaints()
      const startCode = getIterator(
        animals[active].sequence,
        createApi(capabilities, animals.length - 1, palette)
      )
      const it = createIterator(startCode)
      yield actions.setTeacherRunning(true)
      yield actions.runTeacherBot(it, animals.length - 1)
      yield actions.setEditorIsDirty(true)
      yield actions.setTeacherRunning(false)
    },
    * revealTogglePaints ({ state, actions }) {
      const { initialData, rand } = state
      const { initialPainted } = initialData
      const togglePaints = filter(val => val === 'toggle', initialPainted)
      const toggleColors = ['blue', 'yellow']
      const color = toggleColors[Math.floor(rand(2, 0))]
      yield actions.setTeacherRunning(true)
      for (let loc in togglePaints) {
        for (let i = 0; i < 6; i++) {
          yield actions.revealTogglePixel(loc, toggleColors[i % 2], i)
        }
        yield actions.paintTogglePixel(loc, color)
      }
      yield actions.setTeacherRunning(false)
    },
    * revealTogglePixel ({ state, actions }, loc, color, i) {
      const { speed } = state
      const pause = 1000 / Math.log(speed * 2)
      yield actions.setPainted('painted', loc, color)
      yield sleep(pause / (8 - i))
    },
    * paintTogglePixel ({ state, actions }, loc, color) {
      const { speed } = state
      const pause = 1000 / Math.log(speed * 2)
      yield actions.setPainted('painted', loc, color)
      yield sleep(pause / 2)
    },
    * getAdvancedPainted ({ state, actions }) {
      const { solution, capabilities, palette } = state
      if (solution) {
        yield actions.setTargetPainted(
          getLastFrame(
            state,
            getIterator(
              solution[0].sequence,
              createApi(capabilities, 0, palette)
            )
          )
        )
      }
    },
    * controllerMove ({ props, state, actions }, fn, ...args) {
      const { active } = state
      const frame = fn(state, active, ...args)
      const location = frame.animals[frame.active].current.location
      if (checkBounds(location, state.levelSize)) {
        yield actions.setFrame(frame)
      }
    }
  },
  reducer: {
    resetBoard: (state, initState) => ({
      ...initState,
      editorIsDirty: false,
      pauseState: null,
      completed: false,
      activeLine: -1,
      hasRun: false,
      steps: 0
    }),
    addTeacherBot: state => ({
      animals: maybeAddTeacherBot(state.animals).map(
        a =>
          a.type === 'teacherBot'
            ? { ...a, hidden: false }
            : { ...a, hidden: true }
      )
    }),
    removeTeacherBot: state => ({
      activeLine: -1,
      animals: state.animals.map(
        a =>
          a.type === 'teacherBot'
            ? { ...a, hidden: true }
            : { ...a, hidden: false }
      )
    }),
    setTargetPainted: (state, targetPainted) => ({ targetPainted }),
    setFrame: (state, frame) => ({ ...frame, steps: state.steps + 1 }),
    setInitialPainted: (state, initialPainted) => ({
      startGrid: initialPainted,
      initialPainted
    }),
    setSequence: ({ animals, active }, sequence, modifications) => ({
      animals: updateAnimal(animals, 'sequence', active, sequence),
      modifications
    }),
    gameDidInitialize: (state, game) => ({ ...game, initialData: game }),
    setPainted: (state, grid, coord, color) => ({
      [grid]: { ...state[grid], [coord]: color }
    }),
    setCanvasContext: (state, canvas, name) => ({ [`${name}Canvas`]: canvas }),
    setSolutionChecker: (state, solutionChecker) => ({ solutionChecker }),
    setTeacherRunning: (state, teacherRunning) => ({ teacherRunning }),
    setEditorIsDirty: (state, editorIsDirty) => ({ editorIsDirty }),
    setLocalDescription: (state, description) => ({ description }),
    setRunning: (state, running) => ({ running, hasRun: true }),
    setRunners: (state, runners) => ({ runners, hasRun: true }),
    incrementSteps: state => ({ steps: state.steps + 1 }),
    setRandSeeds: (state, randSeeds) => ({ randSeeds }),
    setCompleted: (state, completed) => ({ completed }),
    animalMove: setAnimalPos,
    animalTurn: turn,
    updateProgramState: (state, activeLine) => ({
      steps: state.steps + 1,
      activeLine
    }),
    setPauseState: (state, payload) =>
      setProp(`pauseState.${payload.i}`, state, payload),
    setActive: (state, { id }) => ({ active: id }),
    setSpeed: (state, speed) => ({ speed: Math.pow(1.6, speed) }),
    setLloc: (state, lloc) => ({ lloc }),
    setReady: () => ({ ready: true }),
    setStepping: (state, stepping) => ({ stepping }),
    setHasRun: (state, hasRun) => ({ hasRun })
  }
})

function maybeAddTeacherBot (animals) {
  if (!animals.some(a => a.type === 'teacherBot')) {
    return animals.concat(addTeacherBot(animals))
  }
  return animals
}

function getRandomSeed (seeds) {
  if (!seeds || seeds.length === 0) return Math.random() * 1000
  return seeds[Math.floor(Math.random() * seeds.length)]
}
