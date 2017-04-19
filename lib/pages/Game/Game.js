/**
 * Imports
 */

import sequenceToCode from 'pages/Game/utils/sequenceToCode'
import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import getIterator from 'pages/Game/utils/getIterator'
import NewGameModal from 'components/NewGameModal'
import createCode from 'utils/createShortCode'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import stackTrace from 'stack-trace'
import animalApis from 'animalApis'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <Game/>
 */

const GameLoader = fire((props) => ({
	game: {ref: `/games/${props.gameRef}`, type: 'once'},
	savedGame: {ref: `/saved/${props.saveRef}`, type: 'once'}
}))(component({
	initialState: {
		ready: false
	},

	render ({props, state, actions, children}) {
		const {savedGame, game, gameRef, saveRef, playlist, initialData = {}} = props

		if (!state.ready) return <Loading/>
		const isDraft = Object.keys(initialData).length > 0
		return (
			(game.value && game.value.type === 'read') || initialData.type  === 'read'
				?	<ReadingChallenge
						draft={isDraft}
						runnerActions={actions}
						game={isDraft ? initialData : game.value}
						savedGame={savedGame.value}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}/>
				: <WritingChallenge
						runnerActions={actions}
						game={game.value}
						savedGame={savedGame.value}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}
						draft={isDraft}
						draftData={initialData}>
						{children}
					</WritingChallenge>
		)
	},

	* onUpdate (prev, {props, state, actions}) {
		if (!state.ready && (!props.game.loading && !props.savedGame.loading)) {
			yield actions.setReady()
		}
	},

	controller: {
		* createRunners ({actions, props, state, context}, animals, onError) {
			try {
				return yield animals.map((animal, id) => actions.createIterator(animal, id))
			} catch (e) {
				yield actions.throwError(e, onError)
			}
		},
		* throwError ({context}, e, onError) {
			const {lineNum, message} = e
			const errorLine = typeof lineNum === 'number'
      	? lineNum
      	: stackTrace.parse(e.e)[0].lineNumber - 5
    	if (onError) {
	      yield onError
    	}
      yield context.openModal({
	    	type: 'error',
	      body: `${message}. Check the code at line ${errorLine + 1}.`,
	      header: 'Error'
      })
		},
		* createIterator ({context, state}, animal, id) {
			const api = animalApis[animal.type].default(id)
	    const it = getIterator(sequenceToCode(animal.sequence), api)
	    if (it.error) {
	    	return Promise.reject({
	    		e: it.error,
	    		message: it.error.name,
	    		lineNum: it.error.loc && it.error.loc.line - 1
	    	})
	    } else {
	    	return Promise.resolve(it)
	    }
		}
	},

	reducer: {
		setReady: () => ({ready: true})
	}
}))

export default component({
	initialState: {
		saveRef: null
	},
	* onCreate ({props, context, actions, state}) {
		const {inProgress, completedByGame} = props.userProfile
		const {gameRef, initialData, finished, saveRef} = props
		if (finished) {
			return yield actions.setSaveRef(saveRef)
		}
		if (!initialData) {
			if (inProgress && inProgress[gameRef] && inProgress[gameRef].saveRef) {
				yield actions.setSaveRef(inProgress[gameRef].saveRef)
			} else if (completedByGame && completedByGame[gameRef] && !state.saveRef) {
				yield context.openModal(() => <NewGameModal
					dismiss={actions.exit}
					createNew={actions.createNewSave}
					load={actions.setSaveRef(completedByGame[gameRef])}
				/>)
			} else {
				yield actions.createNewSave()
			}
		}
	},
	render ({props, state, children}) {
		const {gameRef, playlist, initialData} = props
		const {saveRef} = state
		if (!saveRef && !initialData) return <Loading/>
		return (
			<GameLoader key={'game-loader-' + saveRef} {...props} {...state}>
				{children}
			</GameLoader>
		)
	},
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
		}
	},
	reducer: {
		setSaveRef: (state, saveRef) => ({saveRef})
	}
})
