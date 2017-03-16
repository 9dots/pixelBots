/**
 * Imports
 */

// import Controls from 'components/Controls'
// import Output from 'components/Output'
// import {initializeGame} from '../actions'
import initialGameState from 'utils/initialGameState'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import objEqual from '@f/equal-obj'
import setProp from '@f/set-prop'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'
import fire from 'vdux-fire'

/**
 * <Game/>
 */

const Game = fire((props) => ({
	game: {ref: `/games/${props.gameRef}`, type: 'once'},
	saved: {ref: `/saved/${props.saveRef}`, type: 'once'}
}))(component({
	initialState: {...initialGameState, ready: false},
	* onCreate ({actions}) {
		yield sleep(5000)
		yield actions.animalMove({id: 0, location: [3, 1]})
	},
	* onUpdate ({state, props, actions}) {
		const {game, saved} = props
		if (!state.ready && (!game.loading && !saved.loading)) {
			yield actions.gameDidInitialize()
		}
	},
  render ({props, state}) {
  	const {game, saved} = props
  	const {ready} = state

  	if (!ready) return <Loading/>
  	console.log(game, saved)
    return (
    	<Block>
    		<Block> Game is ready </Block>
    	</Block>
    )
  },
  controller: {
		* paintSquare ({actions, state}, {id, color}) {
			const location = state.animals[id].current.location
			yield actions.animalPaint({id, location, color})
		}
	},
  reducer: {
		animalMove: (state, {id, location}) => updateAnimal(state, 'current.location', id, location),
		animalPaint: (state, {id, location, color}) => updateAnimal(state, `game.painted.${location}`, id, color),
		animalTurn: (state, {id, rot}) => updateAnimal(state, 'current.rot', id, rot),
		setLocalDescription: (state, description) => ({description}),
		incrementSteps: (state) => ({steps: state.steps + 1}),
		setActive: (state, {id}) => ({active: id}),
  	gameDidInitialize: () => ({ready: true}), 
		setSpeed: (state, speed) => ({speed}),
		setSaved: (state, saved) => ({saved}),
		incrementalPaint: (state, {grid, coord, color}) => setProp(
			`${grid}.${coord}`,
			state[grid], 
			state[grid][coord] === color ? 'white' : color
		)
  }
}))

function updateAnimal (state, path, id, val) {
	return {
		animals: state.animals.map((animal, i) => {
			if (i === id) {
				return setProp(path, animal, val)
			}
		})
	}
}
/** @jsx element */

export default component({
	initialState: {
		saveRef: null
	},
	* onCreate ({props, context, actions}) {
		const {inProgress, completed} = props.userProfile
		const {gameRef} = props
		if (inProgress && inProgress[gameRef]) {
			yield setSaveRef(inProgress[gameRef].saveRef)
		} else if (completed && completed[gameRef]) {
			yield context.openModal({
				header: 'Make a new game?',
				body: 'Would you like to make a new game or view your previous code?'
			})
		} else {
			yield actions.createNewSave()
		}
	},
	render ({props, state}) {
		const {gameRef} = props
		const {saveRef} = state
		if (!saveRef) return <Loading/>
		return (
			<Game gameRef={gameRef} saveRef={saveRef}/>
		)
	},
	controller: {
		* createNewSave ({props, actions, context}) {
			const {key} = yield context.firebasePush(`/saved`, {
				gameRef: props.gameRef,
				animals: []
			})
			yield actions.setSaveRef(key)
		}
	},
	reducer: {
		setSaveRef: (state, saveRef) => ({saveRef})
	}
})

// function render ({props, state, local, children}) {
//   const {
//     selectedLine,
//     activeLine,
//     saveID,
//     gameData,
//     publish,
//     running,
//     hasRun,
//     active,
//     mine,
//     game
//   } = props

//   const {
//     inputType,
//     animals
//   } = game

//   const size = '350px'

//   const display = (
//     <Block wide tall align='start start'>
//       <Output
//         size={size}
//         hasRun={hasRun}
//         {...game}
//         {...props} />
//       <Controls
//         selectedLine={selectedLine}
//         initialData={initialData}
//         activeLine={activeLine}
//         inputType={inputType}
//         canCode={game.permissions.indexOf(EDIT_CODE) > -1}
//         running={running}
//         saveID={saveID}
//         saved={game.saved}
//         animals={animals}
//         gameData={gameData}
//         hasRun={hasRun}
//         active={active} />
//     </Block>
//   )

//   return (
//     <Block tall wide minHeight='600px'>
//       <Block
//         relative
//         display='flex'
//         left='0'
//         tall
//         pr='10px'
//         wide>
//         {display}
//       </Block>
//       {children}
//     </Block>
//   )
// }
