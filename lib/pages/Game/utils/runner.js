import {endRun} from '../middleware/codeRunMiddleware'
import isIterator from '@f/is-iterator'
import getIterator from './getIterator'
import flattenGen from '@f/flatten-gen'
import animalApis from 'animalApis'
import sleep from '@f/sleep'

function getInterval (animals, id, speed) {
  return getTimeout(animals, id) * 1 / speed
}

function createIterator (animal, id) {
  return new Promise((resolve, reject) => {
    const api = animalApis[animal.type].default(id)
    const code = getIterator(animal, api, id)
    if (code.error) {
      return reject({message: code.error.name, lineNum: (code.error.loc.line) - 1})
    }
    return resolve(code())
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
