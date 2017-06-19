/**
 * Imports
 */

import NewGameModal from 'components/NewGameModal'
import createCode from 'utils/createShortCode'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {debounce} from 'redux-timing'
import {Block} from 'vdux-ui'
import Game from 'pages/Game'
import fire from 'vdux-fire'

/**
 * <Loader/>
 */

const Loader = fire((props) => ({
  game: `/games/${props.gameRef}[once]`,
  savedGame: `/saved/${props.saveRef}[once]`
}))(component({
  initialState: {
    ready: false
  },

  render ({props, state, children}) {
    if (!state.ready) return <Loading />
    const {game, initialData, savedGame} = props
    const isDraft = Object.keys(initialData || {}).length > 0

    return (
      <Block tall wide>
        <Game {...props} game={initialData ? initialData : game.value} savedGame={savedGame.value} isDraft={isDraft} />
        {children}
      </Block>
    )
  },

  * onUpdate (prev, {props, state, actions}) {
    if (!state.ready && (!props.game.loading && !props.savedGame.loading)) {
      yield actions.setReady()
    }
  },

  reducer: {
    setReady: () => ({ready: true})
  }
}))

/**
 * <GameLoader/>
 */

export default component({
  initialState: {
    saved: true,
    timerStart: null
  },
  render ({props, state, children, actions}) {
    const {gameRef, playlist, initialData, draftData, saveRef} = props

    if (!saveRef && !initialData) return <Loading />

    return (
      <Loader key={'game-loader-' + saveRef} {...props} {...state} {...actions} initialData={initialData}>
        {children}
      </Loader>
    )
  },

  middleware: [
    debounce('save', 1000),
    debounce('incrementSlowdowns', 100)
  ],

  controller: {
    * exit ({context}) {
      yield context.closeModal()
      window.history.back()
    },

    * onComplete ({props, state, context, actions}, data = {}) {
      const {gameRef, playlist, onGameComplete, saveRef} = props
      const {uid, username} = context

      yield actions.save(data)

      yield context.firebaseSet(`/saved/${saveRef}/completed`, true)
      yield context.firebaseTransaction(
        `/saved/${saveRef}/completions`,
        val => (val || 0) + 1
      )
      yield context.closeModal()

      if (playlist) {
        yield onGameComplete()
      } else {
        yield context.setUrl(`/`)
      }
    },

    * save ({context, props, actions}, data = {}) {
      if (props.saveRef) {
        yield actions.incrementTimeElapsed()
        yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
          lastEdited: Date.now(),
          gameRef: props.gameRef,
          uid: context.uid,
          ...data
        })
        if (actions.setSaved) {
          yield actions.setSaved(true)
        }
      }
    },

    * incrementAttempts ({context, state}) {
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/attempts`,
        val => val + 1
      )
    },

    * incrementRuns ({context, state}) {
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/runs`,
        val => val + 1
      )
    },

    * incrementStepperSteps ({context, state}) {
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/stepperSteps`,
        val => val + 1
      )
    },

    * incrementSlowdowns ({context, state}) {
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/slowdowns`,
        val => val + 1
      )
    },

    * incrementTimeElapsed ({context, state, actions}) {
      const timeCheckpoint = Date.now()
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/timeElapsed`,
        val => val + (timeCheckpoint - state.timerStart)
      )
      yield actions.setTimerStart(timeCheckpoint)
    }
  },
  reducer: {
    setSaveRef: (state, saveRef) => ({saveRef}),
    setSaved: (state, saved) => ({saved}),
    setTimerStart: (state, timerStart) => ({timerStart})
  }
})
