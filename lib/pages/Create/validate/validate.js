/**
 * Imports
 */

import sequenceToCode from 'pages/Game/utils/sequenceToCode'
import {getIterator} from 'utils/frameReducer'
import animalApis, {capabilities} from 'animalApis'
import flatten from 'lodash/flatten'
import level from 'schema/level'
import reduce from '@f/reduce'

/**
 * <Validate/>
 */

 const count = obj => typeof obj === 'object' ? Object.keys(obj).length : 0
 const lengths = (obj) => reduce((acc, val, key) => ({
   ...acc,
   [`${key}Count`]: val && count(val)
 }), {}, obj)

function testCode (sequence, capabilities, state) {
  return () => {
    try {
      getIterator(sequence, animalApis(capabilities, 0))()
      return {valid: true}
    } catch (e) {
      return {valid: false, errors: [{message: e.message}]}
    }
  }
}

const valid = () => ({valid: true})

export default function (state, next) {
   const reqs = {
     options: [],
     create: [
       level.create,
       state.type === 'write' || state.type === 'debug' ? level.stretch : valid
     ],
     preview: [
       level.create,
       state.type === 'write' || state.type === 'debug' ? level.painted : valid,
       state.type === 'read' || state.type === 'debug'
        ? () => level.read({startCode: sequenceToCode(state.animals[0].sequence)})
        : valid
     ],
     solution: [
       level.create,
       level.initialPainted,
       testCode(state.initialPainted, capabilities, state)
     ],
     publish: [
       level.create,
       state.type === 'read' || state.type === 'debug'
        ? () => level.read({startCode: sequenceToCode(state.animals[0].sequence)})
        : valid,
       state.type === 'write' && state.advanced
        ? level.initialPainted
        : valid,
       state.type === 'write' && !state.advanced
        ? level.painted
        : valid,
       state.advanced ? () => level.solution({solution: sequenceToCode(state.solution[0].sequence)}) : valid,
       state.advanced
        ? testCode(state.solution && state.solution[0].sequence, state.capabilities, state)
        : valid
     ]
   }
   const validators = reqs[next]
   const newState = {...state, ...lengths(state)}
   const results = flatten(validators.map(v => v(newState)))
   if (results.some(r => r.valid === false)) {
     const {message} = flatten(results.filter(r => r.valid === false).map(r => r.errors))[0]
     return {isValid: false, message}
   }
   return {isValid: true}
 }
