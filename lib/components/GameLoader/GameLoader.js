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
    saved: true
  },
  render ({props, state, children, actions}) {
    const {gameRef, saveRef, playlist, initialData, draftData} = props
    if (!saveRef && !initialData) return <Loading />

    return (
      <Loader key={'game-loader-' + saveRef} {...props} {...state} {...actions} initialData={initialData}>
        {children}
      </Loader>
    )
  },

  middleware: [
    debounce('save', 1000)
  ],

  controller: {
    * exit ({context}) {
      yield context.closeModal()
      window.history.back()
    },

    * onComplete ({props, state, context, actions}, data = {}) {
      const {gameRef, playlist, saveRef, onGameComplete} = props
      const {uid, username} = context

      const linkRef = yield createCode()
      yield actions.save(data)
      yield context.firebaseSet(`/saved/${saveRef}/completed`, true)

      yield context.closeModal()

      if (playlist) {
        yield onGameComplete()
      } else {
        yield context.setUrl('/')
      }
    },

    * save ({context, state, actions, props}, data = {}) {
      if (props.saveRef) {
        yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
          lastEdited: Date.now(),
          uid: context.uid,
          gameRef: props.gameRef,
          ...data
        })
        yield actions.setSaved(true)
      }
    },

    * incrementAttempts ({props, context, state}) {
      yield context.firebaseTransaction(
        `/saved/${props.saveRef}/meta/attempts`,
        val => val + 1
      )
    }
  },
  reducer: {
    setSaved: (state, saved) => ({saved})
  }
})
