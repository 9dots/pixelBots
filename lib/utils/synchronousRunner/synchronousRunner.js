import {moveAnimal, paintSquare, turnAnimal} from 'pages/Game/middleware/botsMiddleware'
import isIterator from '@f/is-iterator'
import setProp from '@f/set-prop'
import Switch from '@f/switch'

function getFrames (actions, botState) {
	return actions.reduce((arr, next, i) => {
		const prevState = arr[i - 1]
			? arr[i - 1]
			: botState
		return arr.concat(processAction(next, prevState))
	}, [])

	function processAction (frame, botState) {
		if (!Array.isArray(frame)) frame = [frame]
		return frame.reduce((obj, next) => performAction(obj, getAction(obj, next)), botState)
	}

	function performAction (runState, action) {
		switch (action.type) {
			case 'animalPaint':
				let {location, color} = action.payload
				return {
					...runState,
					painted: {...runState.painted, [location]: color}
				}
			case 'animalMove':
				return {
					...runState,
					animals: updateAnimal(runState, 'current.location', action.payload.id, action.payload.location)
				}
			case 'animalTurn':
				let {id, rot} = action.payload
				return {
					...runState,
					animals: updateAnimal(runState, 'current.rot', id, rot % 360)
				}
		}
		return runState
	}
}

function getAction (state, action) {
	return Switch({
		[moveAnimal.type]: handleAnimalMove,
		[paintSquare.type]: handlePaintSquare,
		[turnAnimal.type]: handleAnimalTurn,
		default: () => action
	})(action.type, action.payload)

	function handlePaintSquare ({id, color}) {
    const {animals} = state
    const location = animals[id].current.location
		return {
			type: 'animalPaint',
			payload: {id, color, location}
		}
	}

	function handleAnimalTurn ({id, turn}) {
    const {animals} = state
    const rot = animals[id].current.rot + turn
    return {
    	type: 'animalTurn',
    	payload: {id, rot}
    }
	}

	function handleAnimalMove ({id, getLocation, lineNum}) {	
		const {animals} = state
    const newLocation = getLocation(animals[id].current.location, animals[id].current.rot)
    return {
    	type: 'animalMove',
    	payload: {id, location: newLocation}
    }
	}
}

function getActions (it) {
	let actions = []
	return getNextAction()
	function getNextAction () {
		const result = it.next()
		if (result.done) {
			return actions
		} else if (result.value && isIterator(result.value.payload)) {
			actions.push(...getActions(result.value.payload))
		} else {
			actions.push(result.value)
		} 
		return getNextAction()
	}
}

function updateAnimal (state, path, id, val) {
	return state.animals.map((animal, i) => {
			return i === id
				? setProp(path, animal, val)
				: animal
		})
}

export {
	getActions,
	getFrames
}

