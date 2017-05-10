import * as runnerActions from 'pages/Game/middleware/codeRunMiddleware'
import PrintContainer from 'components/PrintContainer'
import initialGameState from 'utils/initialGameState'
import {createRunners} from 'pages/Game/utils/runner'
import GameOutput from 'components/GameOutput'
import createCode from 'utils/createShortCode'
import GameInput from 'components/GameInput'
import linesOfCode from 'utils/linesOfCode'
import {component, element} from 'vdux'
import {getInterval} from 'utils/animal'
import isIterator from '@f/is-iterator'
import Layout from 'layouts/MainLayout'
import mw from 'pages/Game/middleware'
import {debounce} from 'redux-timing'
import mapValues from '@f/map-values'
import deepEqual from '@f/deep-equal'
import animalApis from 'animalApis'
import {Block, Text} from 'vdux-ui'
import setProp from '@f/set-prop'
import unique from '@f/unique'
import range from '@f/range'
import sleep from '@f/sleep'
import omit from '@f/omit'
import map from '@f/map'

/**
 * <WritingChallenge/>
 */

export default component({
	initialState ({props}) {
		const {game, savedGame, draftData} = props
		if (Object.keys(draftData).length > 0) {
			return {...initialGameState, ...draftData}
		}
		return {...initialGameState, ...game, ...savedGame, saved: true}
	},

	* onCreate ({state, actions}) {
		yield actions.gameDidInitialize(state)
	},

  render ({props, state, actions, children}) {
  	const {playlist, draftData, isProject} = props
  	const {initialData, animals, active, targetPainted} = state

  	const gameDisplay = (
  		<Block tall wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		    		<GameOutput
		    			{...initialData}
		    			{...omit('runners', state)}
		    			size='350px'
		    			isProject={isProject}
		    			active={state.active}
		    			speed={state.speed}
		    			gameActions={actions} />
					</Block>
					<Block flex tall>
						<GameInput {...initialData} {...state} gameActions={actions} initialData={initialData} canCode clipboard={state.clipboard} />
					</Block>
				</Block>
				{children}
			</Block>
  	)

  	if (Object.keys(draftData).length > 0) return gameDisplay

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

  	if (!props.draft && prev.state.animals.some(({sequence}, i) => sequence !== state.animals[i].sequence)) {
  		yield actions.setSaved(false)
  		yield actions.saveCode()
  	}

  	if (!isEqualSequence(prev.state.animals, state.animals)) {
  		yield actions.setCompleted(true)
  	}

  	if (!prev.state.hasRun && state.hasRun) {
  		yield actions.run()
  	}

  	if (!deepEqual(prev.state.targetPainted, state.targetPainted)) {
  		yield actions.setSaved(false)
  		yield actions.saveCode()
  	}

  	if (state.hasRun && !prev.state.running && state.running) {
  		yield actions.run()
  	}
  },

	middleware: [
		...mw,
		debounce('saveCode', 1500)
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
			yield actions.setBlockPayload(state.active, block, {...payload, [pos]: arg})
		},
		* onRunFinish ({actions}) {
			yield actions.setRunning(false)
			yield actions.setCompleted(true)
		},
		* runCode ({actions, state, context, props}) {
			const {animals, running, completed, hasRun, runners, pauseState} = state
			yield actions.setRunning(true)
			if (running) {
				return yield actions.setRunning(false)
			} else if (completed || !hasRun) {
				yield actions.reset()
				yield sleep(50)
				yield actions.setRunning(true)
				const its = yield props.runnerActions.createRunners(
					animals,
					[actions.setCompleted(true), actions.setRunning(false)]
				)
				if (its) {
					yield actions.setRunners(its)
					yield context.firebaseTransaction(
						`/saved/${props.saveRef}/meta/attempts`,
						(val) => val + 1
					)
				}
			}
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
		* stepForward ({props, state, actions}) {
			const {completed, hasRun, animals, pauseState, stepping} = state
			if (stepping) { return }
			yield actions.setStepping(true)
			if (completed || !hasRun) {
				yield actions.reset()
				const newRunners = yield props.runnerActions.createRunners(
					animals,
					[actions.setCompleted(true), actions.setRunning(false)]
				)
				if (!newRunners) { return }
				yield actions.setHasRun(true)
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
			if (isIterator(value)) {
				return yield actions.step(value, i, it)
			} else if (isIterator(value.payload)) {
				return yield actions.step(value.payload, i, it)
			} else {
				yield actions.handleStepAction(value)
				return [it, i, outerIt]
			}
		},
		* handleStepAction ({actions}, action) {
			const lineNum = action.payload && action.payload.lineNum
	    if (!isNaN(lineNum) && lineNum >= 0) {
	      yield actions.setActiveLine(lineNum)
	    }
	    yield actions.incrementSteps()
	    yield action
		},
		* onComplete ({context, actions, state, props}, frames) {
			const {draft, saveRef, runnerActions} = props
			const {levelSize, animals} = state
			const loc = linesOfCode(animals[0].sequence)
			yield context.openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`))
			if (!draft) {
				yield runnerActions.onComplete()
			}
		},
		* saveCode ({context, props, state, actions}) {
			if (props.saveRef) {
				yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
					lastEdited: Date.now(),
					targetPainted: state.targetPainted,
					uid: context.uid,
					animals: state.animals
				})
				yield actions.setSaved(true)
			}
		},
		...map(wrapEffect, runnerActions)
	},
  reducer: {
		reset: (state) => ({
			activeLine: -1,
			painted: state.initialPainted,
			steps: 0,
			selected: [],
			clipboard: [],
			readOnly: false,
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
  	gameDidInitialize: (state, game) => ({initialData: game, ...game, painted: game.initialPainted || {}}),
		animalTurn: (state, {id, rot}) => updateAnimal(state, 'current.rot', id, rot),
		setCode: (state, id, code) => updateAnimal(state, 'sequence', id, code),
		addBlock: (state, id, block) => addBlock(state, id, {...block}),
		removeBlock: (state, id, block) => removeBlock(state, id, block),
		invertSelection: state => ({
			selected: state.selected.length
				? []
				: (state.animals[state.active].sequence || []).filter(b => b.type !== 'repeat_end')
		}),
		removeSelected: state => removeSelected(state),
		clearSelection: state => ({selected: []}),
		cutSelection: state => ({
			...state.selected.reduce((state, block) => removeBlock(state, state.active, block), state),
			selected: [],
			clipboard: expandSelectedLoops(state.animals[state.active].sequence, state.selected),
			editorState: getEditorState(state)
		}),
		copySelection: state => ({
			clipboard: expandSelectedLoops(state.animals[state.active].sequence, state.selected)
		}),
		paste: state => paste(state),
		setBlockPayload: (state, id, block, payload) => ({
			editorState: getEditorState(state),
			...updateAnimal(state, 'sequence', id, state.animals[id].sequence.map(b => b === block ? {...b, payload} : b))
		}),
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
		selectBlock: (state, block) => selectBlock(state, block),
		setHasRun: (state, hasRun) => ({hasRun}),
		setRunning: (state, running) => ({running}),
		setPainted: (state, grid, coord, color) => setProp(
			`${grid}.${coord}`,
			state,
			color
		),
		undo: undo
  }
})

function paste (state) {
	const idxs = state.selected
		.map(b => state.animals[state.active].sequence.indexOf(b))
		.sort(cmp)
	const idx = state.selected.length ? idxs[0] : state.cursor
	const blocks = state.clipboard.map(b => ({...b}))

	if (state.selected.length) {
		state = removeSelected(state)
	}

	return {
		selected: [],
		editorState: getEditorState(state),
		...insertBlocks(state, blocks, idx)
	}
}

function insertBlocks (state, blocks, idx) {
	blocks = [].concat(blocks).filter(Boolean)

	return updateAnimal(
		state,
		'sequence',
		state.active,
		insertAt(state.animals[state.active].sequence || [], idx, blocks.map(b => ({...b})))
	)
}

function removeSelected (state) {
	return {
		...state.selected.reduce((state, block) => removeBlock(state, state.active, block), state),
		editorState: getEditorState(state),
		selected: []
	}
}

function selectBlock (state, block) {
	if (state.selected.length === 0) {
		return {selected: [block]}
	} else if (state.selected.indexOf(block) !== -1) {
		return {selected: []}
	}

	const seq = state.animals[state.active].sequence
	const seqIdx = seq.indexOf(block)
	const selIndices = state
		.selected
		.map(b => seq.indexOf(b))
		.sort(cmp)

	const start = Math.min(selIndices[0], seqIdx)
	const end = Math.max(selIndices[selIndices.length - 1], seqIdx)

	return {
		selected: range(start, end + 1).map(i => seq[i])
	}
}

function undo (state) {
	const {cursor, sequences} = state.editorState[state.editorState.length - 1]
	return {
		animals: state.animals.map((a, i) => ({...a, sequence: sequences[i]})),
		editorState: state.editorState.slice(0, -1),
		selected: [],
		cursor
	}
}

function getSequences (animals) {
	return animals.map((a) => a.sequence)
}

function isEqualSequence (a, b) {
	return deepEqual(getSequences(a), getSequences(b))
}

function getEditorState (state) {
	return state.editorState.concat({sequences: getSequences(state.animals), cursor: state.cursor})
}

function addBlock (state, id, block) {
	const {cursor, selected, animals} = state

	if (block.type === 'repeat') {
		if (selected.length) {
			return surroundBlocks(state, id, selected, block)
		}

		return {
			...insertBlocks(state, [block, {type: 'repeat_end'}], cursor),
			cursor: cursor + 1,
			editorState: getEditorState(state)
		}
	} else if (selected.length) {
		const idxs = selected
			.map(b => state.animals[state.active].sequence.indexOf(b))
			.sort(cmp)

		state = removeSelected(state)

		return {
			...state,
			...insertBlocks(state, block, idxs[0]),
			cursor: state.cursor > state.animals[id].sequence.length
				? state.animals[id].sequence.length - 1
				: state.cursor,
			selected: []
		}
	}

	return {
		...insertBlocks(state, block, cursor),
		cursor: cursor + 1,
		editorState: getEditorState(state)
	}
}

function surroundBlocks (state, id, selected, block) {
	selected = expandSelectedLoops(state.animals[id].sequence, selected)

	const idxs = selected
		.map(b => state.animals[id].sequence.indexOf(b))
		.sort(cmp)

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
		cursor: state.cursor + 1,
		editorState: getEditorState(state)
	}
}


function cmp (a, b) {
	return a === b ? 0 : a < b ? -1 : 1
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
		}),
		cursor: Math.min((state.animals[state.active].sequence || []).length, state.cursor)
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

function winMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
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
