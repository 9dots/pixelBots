/**
 * Imports
 */

import * as runnerActions from './middleware/codeRunMiddleware'
import * as botActions from './middleware/botsMiddleware'
import PrintContainer from 'components/PrintContainer'
import initialGameState from 'utils/initialGameState'
import NewGameModal from 'components/NewGameModal'
import CodeEditor from 'components/CodeEditor'
import GameOutput from 'components/GameOutput'
import createCode from 'utils/createShortCode'
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
import unique from '@f/unique'
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
  	const {ready, initialData, animals, active} = state

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
    	<Block tall>
	    	<PrintContainer code={animals[active].sequence}/>
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
    	</Block>
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
		* setArgument ({state, actions}, block, pos, arg) {
			const {payload = []} = block
			payload[pos] = arg

			yield actions.setBlockPayload(state.active, block, payload)
		},
		* onRunFinish ({actions}) {
			yield actions.setRunning(false)
			yield actions.setCompleted(true)
		},
		* createRunners ({actions, state}) {
			const {animals} = state
			const newRunners = yield createRunners(animals)
			yield actions.reset()
			yield actions.setRunners(newRunners)
			return newRunners
		},
		* runCode ({actions, state, context, props}) {
			const {animals, running, completed, hasRun, runners, pauseState} = state
			if (running) {
				return yield actions.setRunning(false)
			} else if (completed || !hasRun) {
				yield actions.createRunners()
				yield sleep(200)
				yield context.firebaseTransaction(
					`/saved/${props.saveRef}/meta/attempts`,
					(val) => val + 1
				)
			}
			yield actions.setRunning(true)
		},
		* run ({actions, state}) {
			const {pauseState, runners} = state
			pauseState
				? yield mapValues(({it, i, onComplete}) => actions.runBot(it, i, onComplete), pauseState)
				: yield runners.map((it, i) => actions.runBot(it, i))
		},
		* runBot ({actions, state}, it, i, onComplete) {
			const {running, animals, speed} = state
			if (!running) {
				return yield actions.setPauseState({it, i, onComplete})
			}
			const interval = getInterval(animals[i], speed)
			const args = yield actions.step(it, i, onComplete)
			if (args) {
				yield sleep(interval)
				yield actions.runBot(...args)
			} else {
				yield actions.onRunFinish()
			}
		},
		* stepForward ({state, actions}) {
			const {completed, hasRun, animals, pauseState, stepping} = state
			if (stepping) return
			yield actions.setStepping(true)
			if (completed || !hasRun) {
				yield actions.reset()
				yield sleep(200)
				const newRunners = yield actions.createRunners()
				const its = yield newRunners.map((it, i) => actions.step(it, i))
				yield its.map(([it, i, onComplete]) => actions.setPauseState({it, i, onComplete}))
			} else {
				const its = yield mapValues(({it, i, onComplete}) => actions.step(it, i, onComplete), pauseState)
				if (Object.keys(its.filter((res) => !!res)).length < 1) {
					yield actions.onRunFinish()
				} else {
					yield its.map(([it, i, onComplete]) => actions.setPauseState({it, i, onComplete}))
				}
			}
			yield actions.setStepping(false)
		},
		* step ({state, actions}, it, i, outerIt) {
			const {animals, running, speed} = state
			const {value, done} = it.next()
			if (done) {
				if (outerIt) {
					return yield actions.step(outerIt, i)
				}
				return false
			}
			if (isIterator(value.payload)) {
				return yield actions.step(value.payload, i, it)
			} else {
				yield actions.handleStepAction(value)
				return [it, i, outerIt]
			}
		},
		* handleStepAction ({actions}, action) {
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
				const {saveRef, gameRef} = props
				const {uid} = context
				const linkRef = yield createCode()
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
			painted: state.initialPainted,
			steps: 0,
			selected: [],
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
  	gameDidInitialize: (state, game) => ({ready: true, initialData: game, ...game, speed: state.speed}),
		animalTurn: (state, {id, rot}) => updateAnimal(state, 'current.rot', id, rot),
		setCode: (state, id, code) => updateAnimal(state, 'sequence', id, code),
		addBlock: (state, id, block) => addBlock(state, id, state.selected, block),
		invertSelection: state => ({
			selected: state.selected.length
				? []
				: state.animals[state.active].sequence || []
		}),
		removeSelected: state => ({
			...state.selected.reduce((state, block) => removeBlock(state, state.active, block), state),
			selected: []
		}),
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
		setCursor: (state, cursor) => ({cursor}),
		setStepping: (state, stepping) => ({stepping}),
		selectBlock: ({selected}, block) => ({
			selected: selected.some(b => b === block)
				? selected.filter(b => b !== block)
				: selected.concat(block)
		}),
		setHasRun: (state, hasRun) => ({hasRun}),
		setRunning: (state, running) => ({running}),
		incrementalPaint: (state, {grid, coord, paintColor}) => setProp(
			`${grid}.${coord}`,
			state,
			state[grid][coord] === paintColor ? 'white' : paintColor
		)
  }
}))

function addBlock (state, id, selected, block) {
	const {cursor, animals} = state

	if (block.type === 'repeat') {
		if (selected.length) {
			return surroundBlocks(state, id, selected, block)
		}

		return {
			...updateAnimal(state, 'sequence', id, insertAt(animals[id].sequence || [], cursor, [
				block,
				{type: 'repeat_end'}
			])),
			cursor: cursor + 1
		}
	}

	return {
		...updateAnimal(state, 'sequence', id, insertAt(animals[id].sequence || [], cursor, block)),
		cursor: cursor + 1
	}
}

function surroundBlocks (state, id, selected, block) {
	selected = expandSelectedLoops(state.animals[id].sequence, selected)

	const idxs = selected
		.map(b => state.animals[id].sequence.indexOf(b))
		.sort((a, b) => a === b ? 0 : a < b ? -1 : 1)

	let start = idxs[0]
	let inserted = 0
	let sequence = state.animals[id].sequence.slice()

	for (let i = 1; i < idxs.length; i++) {
		if (idxs[i] > idxs[i-1] + 1) {
			sequence.splice((start + inserted++), 0, {...block})
			sequence.splice(idxs[i-1] + 1 + (inserted++), 0, {type: 'repeat_end'})
			start = idxs[i]
		}
	}

	sequence.splice((start + inserted++), 0, {...block})
	sequence.splice(idxs[idxs.length - 1] + 1 + (inserted++), 0, {type: 'repeat_end'})

	return {
		...updateAnimal(state, 'sequence', id, sequence),
		selected: [],
		cursor: state.cursor + 1
	}
}

/**
 * expandSelectedLoops
 *
 * Expand the selection to include the entirety of any loops
 * that have been selected
 */

function expandSelectedLoops (sequence, selected) {
	return unique(selected.reduce((acc, block) => {
		if (block.type === 'repeat') {
			const idx = sequence.indexOf(block)
			const loop = [block]
			let level = 0

			for (let i = idx + 1; i < sequence.length; i++) {
				const item = sequence[i]
				loop.push(item)

				if (item.type === 'repeat') {
					level++
				} else if (item.type === 'repeat_end') {
					if (level === 0) {
						break
					} else {
						level--
					}
				}
			}

			return acc.concat(unique(loop))
		}

		return acc.concat(block)
	}, []))
}

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

		if (endBlock) {
			state = removeBlock(state, id, endBlock)
		}
	}

	const nextState = updateAnimal(state, 'sequence', id, state.animals[id].sequence.filter(b => b !== block))

	return {
		...state,
		...nextState,
		activeLine: Math.min(state.activeLine, nextState.animals[id].sequence.length),
		cursor: Math.min(state.cursor, nextState.animals[id].sequence.length)
	}
}

export default component({
	initialState: {
		saveRef: null
	},
	* onCreate ({props, context, actions, state}) {
		const {inProgress, completedByGame} = props.userProfile
		const {gameRef, initialData} = props
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
			const {uid, username} = context
			const {gameRef} = props
			const {key} = yield context.firebasePush(`/saved`, {
				gameRef: props.gameRef,
				creatorID: uid,
				animals: [],
				username
			})

			yield context.firebaseSet(`/users/${uid}/inProgress/${gameRef}`, {
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
