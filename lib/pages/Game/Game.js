/**
 * Imports
 */

import ReadingChallenge from 'components/ReadingChallenge'
import WritingChallenge from 'components/WritingChallenge'
import NewGameModal from 'components/NewGameModal'
import createCode from 'utils/createShortCode'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
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

	render ({props, state, children}) {
		const {savedGame, game, gameRef, saveRef, playlist, initialData} = props
		if (!state.ready) return <Loading/>

		return (
			game.value && game.value.type === 'read'
				?	<ReadingChallenge
						game={game.value}
						savedGame={savedGame.value}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}
						draftData={initialData}/>
				: <WritingChallenge
						game={game.value}
						savedGame={savedGame.value}
						gameRef={gameRef}
						saveRef={saveRef}
						playlist={playlist}
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
		const {gameRef, initialData, finished} = props
		if (finished) {
			return yield actions.setSaveRef(completedByGame[gameRef])
		}
		if (!initialData) {
			if (inProgress && inProgress[gameRef] && inProgress[gameRef].saveRef) {
				yield actions.setSaveRef(inProgress[gameRef].saveRef)
			} else if (completedByGame && completedByGame[gameRef] && !state.saveRef) {
				yield context.openModal(() => <NewGameModal
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
		return <GameLoader {...props} {...state}>
			{children}
		</GameLoader>
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
		}
	},
	reducer: {
		setSaveRef: (state, saveRef) => ({saveRef})
	}
})
