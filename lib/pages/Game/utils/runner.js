import {endRun} from '../middleware/codeRunMiddleware'
import {fetch} from 'redux-effects-fetch'
import isIterator from '@f/is-iterator'
import sequenceToCode from './sequenceToCode'
import flattenGen from '@f/flatten-gen'
import animalApis from 'animalApis'
import sleep from '@f/sleep'

function getInterval (animals, id, speed) {
  return getTimeout(animals, id) * 1 / speed
}

function createIterator (animal, id) {
  const api = animalApis[animal.type].default(id)
  return fetch('https://us-central1-artbot-dev.cloudfunctions.net/autoYield', {
    method: 'POST',
    body: {
      code: sequenceToCode(animal, api, id),
      api: Object.keys(api)
    }
  }).then(({value}) => {
    if (value.error) {
      return reject({message: value.error.name, lineNum: (value.error.loc.line) - 1})
    }
    return resolve(value())
  })
}

function createRunners (animals) {
  return new Promise((resolve, reject) => {
    Promise.all(animals.map((animal, id) => createIterator(animal, id)))
      .then(resolve)
      .catch(reject)
  })
}

export {
  createRunners,
  getInterval
}

const getTimeout = (animals, id) => {
  return !isNaN(id)
    ? animalApis[animals[id].type].speed + 50
    : undefined
}
