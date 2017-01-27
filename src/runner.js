import animalApis from './animalApis'
import {setActiveLine} from './actions'
import getIterator from './getIterator'
import {scrollTo} from './middleware/scroll'
import sleep from '@f/sleep'
import EventEmitter from 'events'

const RUN_OVER = 'RUN_OVER'

function run (it, animals, getSpeed, onValue, onError, onCompleted = () => {}) {
	let running
	return {
		pause: () => running = false,
		run: () => {
			running = true
			keepStepping(it)
		},
		step: (id) => step(it.next(), getInterval(animals, id, getSpeed))
	}

	function keepStepping (it) {
		const result = it.next()
		const interval = getTimeout(animals,  result.value.payload.id) * 1 / getSpeed()
		step(result, interval)
			.then((action) => {
				onValue(action)
				running && keepStepping(...arguments)
			})
			.catch((e) => {
				if (e === RUN_OVER) {
					return onCompleted()
				}
				return onError(e)
			})
	}
}

function getInterval (animals, id, getSpeed) {
	return getTimeout(animals, id) * 1 / getSpeed()
}

function step (nextStep, interval) {
	const {value, done} = nextStep
	return new Promise((resolve, reject) => {
		if (value.type === 'END_RUN' || done) {
	  	return reject(RUN_OVER)
	  }
	  return setTimeout(() => resolve(value), interval)
	})
}

function createIterator (animal, id) {
	return new Promise((resolve, reject) => {
    const api = animalApis[animal.type].default(id)
    const code = getIterator(animal, api, id)
    if (code.error) {
      return reject({message: code.error.name, lineNum: (code.error.loc.line) - 1})
    }
    return resolve(code)
	})
}

function createIterators (animals) {
	return new Promise((resolve, reject) => {
	  Promise.all(animals.map((animal, id) => createIterator(animal, id)))
	  	.then((iterators) => resolve(iterators))
	  	.catch((e) => reject(e))
	})
}

export {
	createIterators,
	getInterval,
	step,
	run
}


const getTimeout = (animals, id) => {
  return !isNaN(id)
    ? animalApis[animals[id].type].speed + 50
    : undefined
}
