import createAction from '@f/create-action'
import autoYield from 'auto-yield'
import getIterator from '../getIterator.js'
import * as animalApis from '../animalApis/index'
import {
  moveError,
  stopRun
} from '../actions'

const runCode = createAction('RUN_CODE')
const runAction = createAction('RUN_ACTION')
const abortRun = createAction('ABORT_RUN')

const TIMEOUT = 500
let its = []

function codeRunner () {
  return ({getState, dispatch}) => {
    return (next) => (action) => {
      let state = getState()
      if (action.type === runCode.type && !state.running) {
        const animals = state.animals
        for (var id in animals) {
          const api = animalApis[animals[id].type]
          let code = getIterator(animals[id], api(id, getState), TIMEOUT)
          its.push(code)
          dispatch(code)
        }
      }
      if (action.type === abortRun.type || action.type === moveError.type) {
        its.forEach((it) => {
          try {
            it.throw(new Error(action.payload))
          } catch (e) {
            if (e.message !== 'STOP') {
              alert(e)
            }
          }
        })
        dispatch(stopRun())
      }
      if (action.type === stopRun.type) {
        its = []
      }
      return next(action)
    }
  }
}

export default codeRunner
export {
  runCode,
  abortRun
}
