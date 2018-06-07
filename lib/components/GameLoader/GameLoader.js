/**
 * Imports
 */

import Loading from 'components/Loading'
import { component, element } from 'vdux'
import { debounce } from 'redux-timing'
import { Block } from 'vdux-ui'
import reduce from '@f/reduce'
import Game from 'pages/Game'
import fire from 'vdux-fire'
import pick from '@f/pick'

/**
 * <Loader/>
 */

const Loader = component({
  render ({ props, state, children }) {
    const { game, initialData, savedGame, isSingleChallenge, type } = props
    const isDraft = Object.keys(initialData || {}).length > 0
    const newGame = props.gameRef ? game.value : savedGame
    const passedGame = initialData
      ? { ...initialData, type }
      : { ...newGame, type }

    return (
      <Block p={isSingleChallenge && '20'} tall wide>
        <Game
          {...props}
          game={passedGame}
          savedGame={savedGame || {}}
          isDraft={isDraft} />
        {children}
      </Block>
    )
  }
})

/**
 * <GameLoader/>
 */

export default fire(props => ({
  game: props.gameRef ? `/games/${props.gameRef}[once]` : undefined,
  saveData: props.saveRef && `/saved/${props.saveRef}`
}))(
  component({
    initialState: {
      saved: true,
      timerStart: null,
      ready: false
    },

    * onCreate ({ actions }) {
      yield actions.save()
      yield actions.setTimerStart(Date.now())
    },

    render ({ props, state, children, actions }) {
      const { initialData, saveRef } = props
      if (!state.ready) return <Loading />

      return (
        <Loader
          key={'game-loader-' + saveRef}
          {...props}
          {...state}
          {...actions}
          initialData={initialData}>
          {children}
        </Loader>
      )
    },

    middleware: [debounce('save', 1000), debounce('incrementSlowdowns', 100)],

    * onUpdate (prev, { props, state, actions }) {
      if (!state.ready && (!props.game.loading && !props.saveData.loading)) {
        yield actions.setReady(props.saveData.value)
      }
    },

    controller: {
      * exit ({ context }) {
        yield context.closeModal()
        window.history.back()
      },

      * onComplete ({ props, state, context, actions }, data = {}) {
        const { playlist, onGameComplete, saveRef } = props
        const { savedGame = {} } = state

        const stats = {
          ...data,
          ...pick(['loc', 'modifications'], savedGame.meta || {}),
          steps: savedGame.steps
        }

        const best = getBest(savedGame.best, stats)

        yield actions.incrementAttempts()
        yield actions.save({ ...data, best })

        yield context.firebaseSet(`/saved/${saveRef}/completed`, true)
        yield context.firebaseTransaction(
          `/saved/${saveRef}/completions`,
          val => (val || 0) + 1
        )

        if (savedGame.externalUpdate) {
          yield context.fetch(savedGame.externalUpdate.host, {
            method: 'POST',
            body: {
              progress: 100,
              completed: true,
              id: savedGame.externalUpdate.id
            }
          })
        }

        if (playlist) {
          yield onGameComplete(data)
        }
      },

      * saveDocs ({ props, context }, userDocs) {
        yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
          userDocs
        })
      },

      * save ({ context, props, actions }, data = {}) {
        if (props.saveRef && context) {
          yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
            lastEdited: Date.now(),
            gameRef: props.gameRef,
            uid: context.uid,
            ...data
          })
          if (actions.incrementTimeElapsed) {
            yield actions.incrementTimeElapsed()
          }
          if (actions.setSaved) {
            yield actions.setSaved(true)
          }
        }
      },

      * incrementAttempts ({ context, props }) {
        if (props.saveRef) {
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/meta/attempts`,
            val => val + 1
          )
        }
      },

      * incrementRuns ({ context, props }) {
        if (props.saveRef) {
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/meta/runs`,
            val => val + 1
          )
        }
      },

      * incrementStepperSteps ({ context, props }) {
        if (props.saveRef) {
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/meta/stepperSteps`,
            val => val + 1
          )
        }
      },

      * incrementSlowdowns ({ context, props }) {
        if (props.saveRef) {
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/meta/slowdowns`,
            val => val + 1
          )
        }
      },

      * updateSavedSpeed ({ context, props }, newSpeed) {
        if (props.saveRef) {
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/speed`,
            speed => newSpeed
          )
        }
      },

      * incrementTimeElapsed ({ context, state, props, actions }) {
        if (props.saveRef) {
          const timeCheckpoint = Date.now()
          yield context.firebaseTransaction(
            `/saved/${props.saveRef}/meta/timeElapsed`,
            val => val + (timeCheckpoint - state.timerStart)
          )
          yield actions.setTimerStart(timeCheckpoint)
        }
      }
    },
    reducer: {
      setSaveRef: (state, saveRef) => ({ saveRef }),
      setSaved: (state, saved) => ({ saved }),
      setTimerStart: (state, timerStart) => ({ timerStart }),
      setReady: (state, savedGame) => ({
        ready: true,
        savedGame
      })
    }
  })
)

function getBest (best = {}, stats) {
  return reduce(
    (acc, val, key) => {
      if (typeof val !== 'undefined') {
        acc[key] =
          typeof best[key] === 'undefined' || val < best[key] ? val : best[key]
      }
      return acc
    },
    {},
    stats
  )
}
