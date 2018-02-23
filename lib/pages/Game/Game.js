/**
 * Imports
 */

import { getInterval, resetAnimalPos, getAnimalSequences } from 'utils/animal'
import createApi, { teacherBot, createDocs } from 'animalApis'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import initialGameState from 'utils/initialGameState'
import linesOfCode from 'utils/linesOfCode'
import BotModal from 'components/BotModal'
import { component, element } from 'vdux'
import diffKeys from '@f/diff-keys'
import { Block } from 'vdux-ui'
import filter from '@f/filter'
import sleep from '@f/sleep'
import srand from '@f/srand'
import marked from 'marked'
import omit from '@f/omit'
import codeRunMw, {
  initCodeWorker,
  terminateCodeWorker,
  startCodeRun,
  adjustSpeed,
  pauseCodeRun,
  stepCode
} from 'middleware/codeRunMiddleware'
import {
  checkBounds,
  isEqualSequence,
  updateAnimal,
  getIterator,
  setAnimalPos,
  turn,
  getLastFrame
} from 'utils/frameReducer'

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
    docs: {
      ...createDocs(props.game.capabilities, props.game.palette),
      ...props.game.userDocs,
      ...props.savedGame.userDocs
    }
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
        docs: state.docs,
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
      docs: state.docs,
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
        ? {
          ...omit(['steps', 'activeLine', 'paints', 'painted'], state),
          animals: getAnimalSequences(state.animals)
        }
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
      case 'sandbox':
        return (
          <WritingChallenge
            {...passedState}
            {...actions}
            sandboxRef={props.sandboxRef}
            draftData={initialData}
            userAnimal={userAnimal}
            gameHeight={gameHeight}
            saved={saved}
            isSandbox
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

  middleware: [codeRunMw],

  * onUpdate (prev, { context, props, state, actions }) {
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

      if (props.game.type === 'sandbox') {
        yield context.firebaseSet(
          `/sandbox/${props.sandboxRef}/lastEdited`,
          Date.now()
        )
        yield context.firebaseSet(
          `/users/${context.uid}/sandbox/${props.sandboxRef}`,
          Date.now()
        )
      }
    }

    if (
      prev.state.animals &&
      !isEqualSequence(prev.state.animals, state.animals)
    ) {
      yield actions.setEditorIsDirty(true)
    }

    if (prev.state.docs !== state.docs) {
      yield props.saveDocs(state.docs)
    }

    if (prev.state.speed !== state.speed) {
      yield adjustSpeed(state.speed)
      yield props.updateSavedSpeed(state.speed)
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
    yield terminateCodeWorker()
  },
  controller: {
    * runCode ({ state, actions }) {
      if (state.running) {
        return yield pauseCodeRun()
      } else if (state.editorIsDirty || (state.hasRun && state.completed)) {
        yield actions.reset()
        yield sleep(500)
      } else if (state.hasRun && !state.completed && !state.editorIsDirty) {
        return yield startCodeRun()
      }
      yield actions.setRunning(true)
      yield actions.revealTogglePaints()
      yield actions.runBot(startCodeRun)
      if (state.editorIsDirty) {
        yield actions.setEditorIsDirty(false)
      }
    },
    * onComplete ({ props, state, context }, data) {
      if (!props.isDraft) {
        yield props.onComplete(data)
      } else {
        yield context.closeModal()
      }
    },
    * throwError ({ actions, context }, e) {
      yield context.openModal(e)
      yield actions.setTeacherRunning(false)
      yield actions.removeTeacherBot()
      yield actions.onRunFinish()
    },
    * onRunFinish ({ actions }) {
      yield [
        actions.setRunning(false),
        actions.setCompleted(true),
        actions.setHasRun(true)
      ]
    },
    * stepForward ({ props, state, actions }) {
      if (!state.hasRun || state.editorIsDirty) {
        if (state.editorIsDirty) {
          yield actions.reset()
          yield sleep(500)
        }
        yield actions.setHasRun(true)
        yield actions.revealTogglePaints()
        yield actions.runBot(stepCode)
      } else {
        yield stepCode()
      }
      if (state.editorIsDirty) {
        yield actions.setEditorIsDirty(false)
      }
    },
    * startOver ({ state, actions, props }) {
      const { userDocs, capabilities, palette, animals } = props.game
      yield actions.gameDidInitialize({
        ...state.initialData,
        modifications: 0,
        docs: userDocs || createDocs(capabilities, palette),
        animals: animals.map((a, i) => ({
          ...a,
          sequence: state.startCode || a.sequence || null
        })),
        rand: srand(getRandomSeed())
      })
    },
    * reset ({ state, actions, props }) {
      const { animals, advanced, initialData, randSeeds, targetPainted } = state
      const teacherCode = initialData.initialPainted
      const newState = {
        rand: srand(getRandomSeed(randSeeds)),
        animals: toggleActiveBot(
          { ...state, active: animals[0].initial },
          false
        ).map(animal => ({
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
        yield actions.updateTeacherBotSequence(teacherCode)
        yield actions.runTeacherBot(animals.length - 1, () => [
          actions.removeTeacherBot(),
          actions.setTeacherRunning(false),
          actions.getAdvancedPainted()
        ])
      }
    },
    * runBot ({ actions, state }, startAction) {
      yield initCodeWorker({
        state: {
          ...state.initialData,
          animals: state.animals.map(a => ({ ...a, current: a.initial })),
          speed: state.speed,
          steps: 0,
          painted: state.painted
        },
        updateAction: actions.mergeFrame(null)
      })
      yield startAction()
    },
    * runTeacherBot ({ actions, state }, i, onComplete) {
      // const interval = getInterval(null, state.speed)
      yield initCodeWorker({
        state: {
          ...state.initialData,
          speed: state.speed,
          animals: state.animals,
          active: i,
          steps: 0,
          painted: state.painted
        },
        updateAction: actions.mergeFrame(onComplete)
      })
      if (state.teacherRunning) {
        yield startCodeRun()
      } else {
        yield [actions.removeTeacherBot(), actions.setTeacherRunning(false)]
        if (!state.teacherRunning) {
          throw new Error('uh oh')
        }
      }
    },
    * runCheck ({ actions, state }, onComplete) {
      const { animals, active } = state
      yield actions.revealTogglePaints()
      yield actions.setTeacherRunning(true)
      yield actions.updateTeacherBotSequence(animals[active].sequence)
      yield actions.runTeacherBot(animals.length - 1, () => [
        onComplete(),
        terminateCodeWorker()
      ])
    },
    * revealTogglePaints ({ state, actions }) {
      const { initialData, rand } = state
      const { initialPainted } = initialData
      const togglePaints = filter(val => val === 'toggle', initialPainted)
      const toggleColors = ['blue', 'yellow']
      yield actions.setTeacherRunning(true)
      for (let loc in togglePaints) {
        const color = toggleColors[Math.floor(rand(2, 0))]
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
        yield actions.setFrame({ ...frame, steps: state.steps + 1 })
      }
    },
    mergeFrame ({ actions, state }, onComplete, { data: { payload, type } }) {
      if (type === 'newState') {
        const newState = payload.animals
          ? {
            ...payload,
            animals: payload.animals.map((a, i) => ({
              ...a,
              sequence: state.animals[i].sequence
            }))
          }
          : payload
        return actions.setFrame({ ...state, ...newState })
      } else if (type === 'done') {
        return [onComplete && onComplete(), actions.onRunFinish()]
      } else if (type === 'throwError') {
        return [actions.throwError(payload), actions.onRunFinish()]
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
    toggleActiveBot: (state, hidden) => ({
      animals: toggleActiveBot(state, hidden)
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
    updateTeacherBotSequence: (state, sequence) => ({
      animals: state.animals.map(
        a => (a.type === 'teacherBot' ? { ...a, sequence } : a)
      )
    }),
    setTargetPainted: (state, targetPainted) => ({ targetPainted }),
    setFrame: (state, frame) => ({ ...frame }),
    setInitialPainted: (state, initialPainted) => ({
      startGrid: initialPainted,
      initialPainted
    }),
    setSequence: ({ animals, active }, sequence, modifications) => ({
      animals: updateAnimal(animals, 'sequence', active, sequence),
      modifications
    }),
    gameDidInitialize: (state, game) => ({
      ...game,
      initialData: game
    }),
    setPainted: (state, grid, coord, color) => ({
      [grid]: { ...state[grid], [coord]: color }
    }),
    setCanvasContext: (state, canvas, name) => ({ [`${name}Canvas`]: canvas }),
    setSolutionChecker: (state, solutionChecker) => ({ solutionChecker }),
    setTeacherRunning: (state, teacherRunning) => ({ teacherRunning }),
    setEditorIsDirty: (state, editorIsDirty) => ({ editorIsDirty }),
    setLocalDescription: (state, description) => ({ description }),
    setRunning: (state, running) => ({ running, hasRun: true }),
    setRandSeeds: (state, randSeeds) => ({ randSeeds }),
    setCompleted: (state, completed) => ({ completed }),
    setLevelSize: (state, levelSize) => ({
      levelSize,
      animals: state.animals.map(a => ({
        ...a,
        current: { ...a.current, location: [levelSize[0] - 1, 0] },
        initial: { ...a.initial, location: [levelSize[0] - 1, 0] }
      })),
      initialData: {
        ...state.initialData,
        levelSize,
        animals: state.animals.map(a => ({
          ...a,
          current: { ...a.current, location: [levelSize[0] - 1, 0] },
          initial: { ...a.initial, location: [levelSize[0] - 1, 0] }
        }))
      }
    }),
    addCapability: (state, name, payload, prevName = '') => ({
      docs: {
        ...filter((val, key) => key !== prevName, state.docs),
        [name]: payload
      }
    }),
    removeCapability: (state, name) => ({
      docs: filter((val, key) => key !== name, state.docs)
    }),
    editCapability: (state, name, args) => ({
      docs: {
        ...state.docs,
        [name]: {
          ...state.docs[name],
          args
        }
      }
    }),
    updateProgramState: (state, activeLine) => ({
      activeLine,
      steps: state.steps + 1
    }),
    setActive: (state, { id }) => ({ active: id }),
    setSpeed: (state, speed) => ({
      speed: Math.pow(1.6, speed)
    }),
    setLloc: (state, lloc) => ({ lloc }),
    setReady: () => ({ ready: true }),
    setHasRun: (state, hasRun) => ({ hasRun }),
    animalMove: setAnimalPos,
    animalTurn: turn
  }
})

function maybeAddTeacherBot (animals) {
  if (!animals.some(a => a.type === 'teacherBot')) {
    return animals.concat(addTeacherBot(animals))
  }
  return animals
}

function toggleActiveBot (state, hidden) {
  return state.animals.map(
    (a, i) => (i === state.active ? { ...a, hidden } : a)
  )
}

function getRandomSeed (seeds) {
  if (!seeds || seeds.length === 0) return Math.random() * 1000
  return seeds[Math.floor(Math.random() * seeds.length)]
}
