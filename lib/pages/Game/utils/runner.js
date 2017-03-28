import {endRun} from '../middleware/codeRunMiddleware'
import getIterator from './getIterator'
import animalApis from 'animalApis'
import isIterator from '@f/is-iterator'

const RUN_OVER = 'RUN_OVER'

function createRunner (it, animals, getSpeed, onValue, onError, onCompleted = () => {}) {
  let running
  return {
    pause: () => running = false,
    run: () => {
      running = true
      keepStepping(it)
    },
    step: (id) => step(it.next(), getInterval(animals, id, getSpeed)).then(onValue)
  }

  function keepStepping (it) {
    const result = it.next()
    if (result.done) {
    	return onCompleted()
    }
    if (result.value && result.value.payload && isIterator(result.value.payload)) {
      running = false
      createRunner(result.value.payload, animals, getSpeed, onValue, onError, () => {
        running = true
        keepStepping(it)
      }).run()
    }
    const interval = getTimeout(animals, result.value.payload.id) * 1 / getSpeed()
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
    if (done || !value) {
      return reject(RUN_OVER)
    }
    if (value.type === 'THROW_ERROR') {
      return reject(value.payload)
    }
    if (interval < 5) {
      return resolve(value)
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

function createRunners (animals, getSpeed, onValue, onError, onCompleted) {
  return new Promise((resolve, reject) => {
    Promise.all(animals.map((animal, id) => createIterator(animal, id)))
      .then((its) => its.map((it) => (
      	createRunner(
	      	it,
	      	animals,
	      	getSpeed,
	      	onValue,
	      	onError,
	      	onCompleted
	      )
      )))
      .then(resolve)
      .catch(reject)
  })
}

export {
  createRunners,
  createRunner,
  getInterval,
  step,
}

const getTimeout = (animals, id) => {
  return !isNaN(id)
    ? animalApis[animals[id].type].speed + 50
    : undefined
}
