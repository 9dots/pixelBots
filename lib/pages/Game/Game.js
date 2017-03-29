/**
 * Imports
 */

import * as runnerActions from './middleware/codeRunMiddleware'
import * as botActions from './middleware/botsMiddleware'
import initialGameState from 'utils/initialGameState'
import CodeEditor from 'components/CodeEditor'
import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import {createRunners} from './utils/runner'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {getInterval} from 'utils/animal'
import isIterator from '@f/is-iterator'
import Layout from 'layouts/MainLayout'
import {debounce} from 'redux-timing'
import mapValues from '@f/map-values'
import objEqual from '@f/equal-obj'
import Grid from 'components/Grid'
import setProp from '@f/set-prop'
import {Block} from 'vdux-ui'
import mw from './middleware'
import sleep from '@f/sleep'
import fire from 'vdux-fire'
import omit from '@f/omit'
import map from '@f/map'

/**
 * <Game/>
 */

const Game = fire((props) => ({
	game: {ref: `/games/${props.gameRef}`, type: 'once'},
	savedGame: {ref: `/saved/${props.saveRef}`, type: 'once'}
}))(component({
	initialState: {...initialGameState, ready: false},

  render ({props, state, actions, children}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {ready, initialData} = state

  	if (!ready) return <Loading/>

  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		    		<GameOutput
		    			{...initialData}
		    			{...omit('runners', state)}
		    			size='350px'
		    			active={state.active}
		    			speed={state.speed}
		    			gameActions={actions} />
					</Block>
					<Block flex tall>
						<GameInput {...initialData} {...state} gameActions={actions} initialData={initialData} canCode />
					</Block>
				</Block>
				{children}
			</Block>
  	)

  	if (draftData) return gameDisplay

    return (
    	<Layout
		    bodyProps={{display: 'flex', px: '10px'}}
		    navigation={[
		    	playlist && {category: 'playlist', title: playlist.title},
		    	{category: 'challenge', title: state.title}
		    ]}
		    titleActions={playlist && playlist.actions}
		    titleImg={playlist ? playlist.img : state.imageUrl}>
    		{gameDisplay}
    	</Layout>
    )
  },

  * onUpdate (prev, {state, props, actions}) {
  	const {game, savedGame, draftData} = props

  	if (!state.ready && (!game.loading && !savedGame.loading)) {
  		if (draftData) {
  			yield actions.gameDidInitialize({...draftData})
  		} else {
  			yield actions.gameDidInitialize({...game.value, ...savedGame.value, saved: true})
  		}
  	}

  	if (!props.draftData && prev.state.animals.some(({sequence}, i) => sequence !== state.animals[i].sequence)) {
  		yield actions.setSaved(false)
  		yield actions.saveCode()
  	}

  	if (!prev.state.running && state.running) {
  		yield actions.run()
  	}
  },

	middleware: [
		...mw,
		debounce('saveCode', 3000)
	],

  controller: {
		* increaseSpeed ({actions, state}) {
			if (state.speed < 16) {
				yield actions.setSpeed(state.speed * 2)
			}
		},
		* decreaseSpeed ({actions, state}) {
			if (state.speed > 0.25) {
				yield actions.setSpeed(state.speed / 2)
			}
		},
		* setArgument ({state, actions}, id, pos, arg) {
			const block = state.animals[id].sequence[state.selectedLine]
			const {payload = []} = block
			payload[pos] = arg

			yield actions.setBlockPayload(id, block, payload)
		},
		* onRunFinish ({actions}) {
			yield actions.setRunning(false)
			yield actions.setCompleted(true)
		},
		* runCode ({actions, state}) {
			const {animals, running, completed, hasRun, runners, pauseState} = state
			if (running) {
				return yield actions.setRunning(false)
			} else if (completed || !hasRun) {
				const newRunners = yield createRunners(animals)
				yield actions.reset()
				yield actions.setRunners(newRunners)
				yield sleep(200)
				yield actions.setRunning(true)
			} else {
				yield actions.setRunning(true)
			}
		},
		* run ({actions, state}) {
			const {pauseState, runners} = state
			pauseState 
				? yield mapValues(({it, i, onComplete}) => actions.runBot(it, i, onComplete), pauseState)
				: yield runners.map(actions.runBot)
		},
		* runBot ({actions, state}, it, i, onComplete) {
			const {speed, animals, running} = state
			const interval = getInterval(animals[i], speed)
			if (!running) {
				return yield actions.setPauseState({it, i, onComplete})
			}
			const {value, done} = it.next()
			if (done) {
				onComplete
					? yield onComplete()
					: yield actions.onRunFinish()
			} else if (isIterator(value.payload)) {
				yield actions.runBot(value.payload, i, actions.runBot(it, i))
			} else {
				yield actions.step(value)
				yield sleep(interval)
				yield actions.runBot(it, i, onComplete)
			}
		},
		* stepForward ({state, actions}) {
			// const {runners, pauseState} = getState()
			// pauseState 
			// 	? yield mapValues(({it, i, onComplete}) => actions.runBot(it, i, onComplete), pauseState)
			// 	: yield runners.map(actions.runBot)
			// 	getRunners()
			// 		.then((runners) => {
			// 			dispatch(actions.setRunners(runners))
			// 			runners.forEach((runner, i) => runner.step(i))
			// 		})
			// 		.catch(({message, lineNum}) => dispatch(throwError({message, lineNum})))
			// }
		},
		* step ({actions}, action) {
			const lineNum = action.payload.lineNum
	    if (!isNaN(lineNum) && lineNum >= 0) {
	      // if (getState().game.inputType === 'icons') {
	      //   dispatch(scrollTo('.code-editor', `#code-icon-${lineNum}`))
	      // }
	      yield actions.setActiveLine(lineNum)
	    }
	    yield actions.incrementSteps()
	    yield action
		},
		* onComplete ({context, actions, state, props}, frames) {
			if (!props.draftData) {
				yield context.firebasePush('/queue/tasks/createGif', {
					gridSize: state.levelSize[0],
					saveID: props.saveRef,
					frames
				})
			}
		},
		* saveCode ({context, props, state, actions}) {
			yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
				lastEdited: Date.now(),
				targetPainted: state.targetPainted,
				uid: context.uid,
				animals: state.animals
			})
			yield actions.setSaved(true)
		},
		...map(wrapEffect, runnerActions),
		...map(wrapEffect, botActions)
	},
  reducer: {
		reset: (state) => ({
			activeLine: -1,
			steps: 0,
			painted: {},
			hasRun: false,
			frames: [],
			runners: {},
			running: false,
			pauseState: undefined,
			completed: false,
			animals: state.animals.map(animal => ({...animal, current: animal.initial}))
		}),
		animalPaint: (state, {id, location, color}) => ({
			frames: state.frames.concat({[state.animals[id].current.location]: color, frame: state.steps}),
			painted: {...state.painted, [location]: color}
		}),
		animalMove: (state, {id, location}) => updateAnimal(state, 'current.location', id, location),
  	gameDidInitialize: (state, game) => ({ready: true, initialData: game, ...game}),
		animalTurn: (state, {id, rot}) => updateAnimal(state, 'current.rot', id, rot),
		setCode: (state, id, code) => updateAnimal(state, 'sequence', id, code),
		addBlock: (state, id, block) => ({
			...updateAnimal(state, 'sequence', id, insertAt(state.animals[id].sequence || [], state.selectedLine, block)),
			selectedLine: state.selectedLine + 1
		}),
		removeBlock: (state, id, block) => removeBlock(state, id, block),
		setBlockPayload: (state, id, block, payload) => updateAnimal(state, 'sequence', id, state.animals[id].sequence.map(b => b === block ? {...b, payload} : b)),
		setLocalDescription: (state, description) => ({description}),
		incrementSteps: (state) => ({steps: state.steps + 1}),
		setRunners: (state, runners) => ({runners, hasRun: true}),
		setActive: (state, {id}) => ({active: id}),
		setSpeed: (state, speed) => ({speed}),
		setSaved: (state, saved) => ({saved}),
		setPauseState: (state, payload) => setProp(`pauseState.${payload.i}`, state, {...payload}),
		setCompleted: (state, completed) => ({completed}),
		setActiveLine: (state, activeLine) => ({activeLine}),
		setSelectedLine: (state, selectedLine) => ({selectedLine}),
		setHasRun: (state, hasRun) => ({hasRun}),
		setRunning: (state, running) => ({running}),
		incrementalPaint: (state, {grid, coord, paintColor}) => setProp(
			`${grid}.${coord}`,
			state,
			state[grid][coord] === paintColor ? 'white' : paintColor
		)
  }
}))

function updateAnimal (state, path, id, val) {
	return {
		animals: state.animals.map((animal, i) => {
			return i === id
				? setProp(path, animal, val)
				: animal
		})
	}
}

function insertAt (list, idx, val) {
	list = list.slice()
	Array.isArray(val)
		? list.splice(idx, 0, ...val)
		: list.splice(idx, 0, val)
	return list
}

function wrapEffect (fn) {
  return (model, ...args) => fn(...args)
}

function removeBlock (state, id, block) {
	if (block.type === 'repeat') {
		const idx = state.animals[id].sequence.indexOf(block)
		let endBlock
		let level = 0

		for (let i = idx + 1; i < state.animals[id].sequence.length; i++) {
			const item = state.animals[id].sequence[i]
			if (item.type === 'repeat') level++
			if (item.type === 'repeat_end') {
				if (level === 0) {
					endBlock = item
					break
				}

				level--
			}
		}

		state = removeBlock(state, id, endBlock)
	}

	return updateAnimal(state, 'sequence', id, state.animals[id].sequence.filter(b => b !== block))
}

export default component({
	initialState: {
		saveRef: null
	},
	* onCreate ({props, context, actions, state}) {
		const {inProgress, completedByGame} = props.userProfile
		const {gameRef, initialData} = props
		if (!initialData) {
			if (inProgress && inProgress[gameRef]) {
				yield actions.setSaveRef(inProgress[gameRef].saveRef)
			} else if (completedByGame && completedByGame[gameRef] && !state.saveRef) {
				yield context.openModal({
					header: 'Make a new game?',
					body: 'Would you like to make a new game or view your previous code?',
					dismiss: actions.setSaveRef(completedByGame[gameRef])
				})
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
			<Game
				gameRef={gameRef}
				saveRef={saveRef}
				playlist={playlist}
				draftData={initialData}>
				{children}
			</Game>
		)
	},
	controller: {
		* createNewSave ({props, actions, context}) {
			const {gameRef} = props
			const {uid} = context
			const {key} = yield context.firebasePush(`/saved`, {
				gameRef: props.gameRef,
				creatorID: uid,
				animals: []
			})

			yield context.firebaseSet(`/users/${uid}/inProgress/${gameRef}`, {
        lastEdited: Date.now(),
				saveRef: key,
        gameRef,
			})

			yield actions.setSaveRef(key)
		}
	},
	reducer: {
		setSaveRef: (state, saveRef) => ({saveRef})
	}
})
