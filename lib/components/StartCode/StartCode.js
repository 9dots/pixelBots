/**
 * Imports
 */

import GridSizeSelector from 'components/GridSizeSelector'
import initialGameState from 'utils/initialGameState'
import GameInput from 'components/GameInput'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import deepEqual from '@f/deep-equal'
import animalApis from 'animalApis'
import Grid from 'components/Grid'
import setProp from '@f/set-prop'
import unique from '@f/unique'
import {Block} from 'vdux-ui'
import range from '@f/range'
import sleep from '@f/sleep'
import omit from '@f/omit'
import map from '@f/map'

/**
 * <Start Code/>
 */

export default component({
	initialState ({props}) {
		return {...initialGameState, ...props}
	},

	* onCreate ({state, actions}) {
		yield actions.gameDidInitialize(state)
	},

  render ({props, state, actions}) {
  	const {initialData, animals, painted, levelSize, active} = state
  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

    return (
    	<Block tall column flex>
    		<Block pt textAlign='center'>
    			<Block fs='m'color='blue'>Add Your Start Code</Block>
    			<Block fs='xs' my>
    				Students will use the start code to draw the resulting picture on the grid.
    			</Block>
    		</Block>
	    	<Block tall align='start'>
	    		{
	    			!props.hideGrid && <Block mr>
			    		<Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0}>
			    			<GridSizeSelector size={levelSize[0]} setSize={actions.setSize} {...btnProps} />
			    		</Block>
			    		<Grid
				      	mode='edit'
				        paintMode
				        animals={animals}
				        painted={painted}
				        levelSize='400px'
				        numRows={levelSize[0]}
				        numColumns={levelSize[1]}
				        />
		        </Block>
	      	}
					<GameInput {...state} gameActions={actions} initialData={initialData} canCode clipboard={state.clipboard} />
				</Block>
			</Block>
    )
  },

  * onUpdate (prev, {props, state, actions}) {
  	if (prev.props.levelSize[0] !== props.levelSize[0])
  	yield actions.gameDidInitialize({
  		...state,
  		animals: props.animals.map((a, i) => ({...a, sequence: state.animals[i].sequence})),
  		levelSize: props.levelSize})
  },

  * onRemove ({actions, props, context, state}) {
  	yield props.save({animals: state.animals.map(a => ({...a, sequence: a.sequence || null}))})
  },

  controller: {
		* setArgument ({state, actions}, block, pos, arg) {
			const {payload = []} = block
			yield actions.setBlockPayload(state.active, block, {...payload, [pos]: arg})
		},
		* setSize ({context, props}, size) {
			yield context.firebaseUpdate(props.ref, {
				levelSize: [size, size],
				animals: props.animals.map(a => ({
					...setProp('current.location', a, [size - 1, 0]),
					sequence: a.sequence || null
				}))
			})
		}
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
  	gameDidInitialize: (state, game) => ({initialData: game, ...game}),
		setCode: (state, id, code) => updateAnimal(state, 'sequence', id, code),
		addBlock: (state, id, block) => addBlock(state, id, {...block}),
		invertSelection: state => ({
			selected: state.selected.length
				? []
				: (state.animals[state.active].sequence || []).filter(b => b.type !== 'repeat_end')
		}),
		removeSelected: state => removeSelected(state),
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
		setActive: (state, {id}) => ({active: id}),
		setSaved: (state, saved) => ({saved}),
		setActiveLine: (state, activeLine) => ({activeLine}),
		setCursor: (state, cursor) => ({cursor}),
		selectBlock: (state, block) => selectBlock(state, block),
		incrementalPaint: (state, {grid, coord, paintColor}) => setProp(
			`${grid}.${coord}`,
			state,
			state[grid][coord] === paintColor ? 'white' : paintColor
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
