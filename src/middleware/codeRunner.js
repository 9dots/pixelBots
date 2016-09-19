import createAction from '@f/create-action'
import getIterator from '../getIterator.js'
import * as animalApis from '../animalApis/index'
import {
  throwError,
  moveError,
  stopRun
} from '../actions'

const runCode = createAction('RUN_CODE')
const abortRun = createAction('ABORT_RUN')

let its = []

function codeRunner () {
  return ({getState, dispatch}) => {
    console.error = function (e) {
      if (e) {
        let activeLine = getState().activeLine + 1
        dispatch(throwError(e.split('\n')[0].trim(), activeLine))
      }
    }
    return (next) => (action) => {
      let state = getState()
      if (action.type === runCode.type && !state.running) {
        const animals = state.animals
        for (var id in animals) {
          const api = animalApis[animals[id].type]
          let code = getIterator(animals[id], api(id, getState))
          if (code.error) {
            return dispatch(throwError(code.error.name, (code.error.loc.line - code.addedLines) - 1))
          }
          its.push(code)
          return dispatch(code)
        }
      }
      if (action.type === abortRun.type || action.type === moveError.type) {
        let activeLine = getState().activeLine
        its.forEach((it) => {
          try {
            it.throw(new Error(action.payload))
          } catch (e) {
            if (action.type === moveError.type) {
              dispatch(throwError('Move error', activeLine))
            } else if (e.message !== 'STOP') {
              dispatch(throwError(e.name, (e.loc.line / 4) - 1))
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
  abortRun,
  throwError
}
