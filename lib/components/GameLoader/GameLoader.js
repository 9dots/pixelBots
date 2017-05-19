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

    console.log(props)
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
    saveRef: null,
    saved: true
  },
  * onCreate ({props, context, actions, state}) {
    const {inProgress, completedByGame} = props.userProfile
    const {gameRef, initialData, finished, draftData, saveRef} = props

    if (finished) {
      return yield actions.setSaveRef(saveRef)
    }

    if (!initialData && !draftData) {
      if (inProgress && inProgress[gameRef] && inProgress[gameRef].saveRef) {
        yield actions.setSaveRef(inProgress[gameRef].saveRef)
      } else if (completedByGame && completedByGame[gameRef] && !state.saveRef) {
        yield context.openModal(() => <NewGameModal
          dismiss={actions.exit}
          createNew={actions.createNewSave}
          load={actions.setSaveRef(completedByGame[gameRef])} />
        )
      } else {
        yield actions.createNewSave()
      }
    }
  },
  render ({props, state, children, actions}) {
    const {gameRef, playlist, initialData, draftData} = props
    const {saveRef} = state

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
    * createNewSave ({props, actions, context}) {
      const {uid, username} = context
      const {gameRef, playlist} = props
      const {key} = yield context.firebasePush(`/saved`, {
        username: username || '',
        gameRef: gameRef,
        creatorID: uid,
        animals: [],
      })

      yield context.firebaseSet(`/users/${uid}/inProgress/${gameRef}`, {
        isInPlaylist: !!playlist,
        lastEdited: Date.now(),
        saveRef: key,
        gameRef
      })

      yield actions.setSaveRef(key)
    },

    * exit ({context}) {
      yield context.closeModal()
      window.history.back()
    },

    * onComplete ({props, state, context, actions}, data = {}) {
      const {gameRef, playlist, onGameComplete} = props
      const {saveRef} = state
      const {uid} = context
      const linkRef = yield createCode()

      yield actions.save(data)

      yield context.firebaseSet(`/saved/${saveRef}/completed`, true)
      yield context.firebaseUpdate(`/users/${uid}/completedByGame`, {
        [gameRef]: saveRef
      })

      yield context.firebaseUpdate(`/users/${uid}/completed/${saveRef}`, {
        saveRef,
        gameRef,
        linkRef,
        lastEdited: Date.now()
      })

      yield context.firebaseUpdate(`/links/${linkRef}`, {
        type: 'shared',
        'payload/gameRef': gameRef,
        'payload/saveRef': saveRef
      })

      yield context.firebaseSet(`/users/${uid}/inProgress/${gameRef}`, null)

      if (playlist) {
        yield onGameComplete()
      }
    },

    * save ({context, state, actions}, data = {}) {
      if (state.saveRef) {
        yield context.firebaseUpdate(`/saved/${state.saveRef}`, {
          lastEdited: Date.now(),
          uid: context.uid,
          ...data
        })
        yield actions.setSaved(true)
      }
    },

    * incrementAttempts ({context, state}) {
      yield context.firebaseTransaction(
        `/saved/${state.saveRef}/meta/attempts`,
        val => val + 1
      )
    }
  },
  reducer: {
    setSaveRef: (state, saveRef) => ({saveRef}),
    setSaved: (state, saved) => ({saved})
  }
})
