import createAction from '@f/create-action'
import getIterator from '../getIterator.js'
import {Observable} from 'rx-lite'
import stackTrace from 'stack-trace'
import * as animalApis from '../animalApis/index'
import {
  setActiveLine,
  throwError,
  moveError,
  startRun,
  stopRun
} from '../actions'

const runCode = createAction('RUN_CODE')
const abortRun = createAction('ABORT_RUN')

function createRunner (it, speed) {
  let curVal = {
    done: false
  }
  return Observable
    .timer(0, speed)
    .map((i) => {
      curVal = it.next()
      return curVal.value
    })
    .takeWhile(() => curVal.done === false)
}

var runners = []

function codeRunner () {
  return ({getState, dispatch}) => {
    return (next) => (action) => {
      let state = getState()
      if (action.type === runCode.type && !state.running) {
        const animals = state.animals
        for (var id in animals) {
          const api = animalApis[animals[id].type](id, getState)
          let code = getIterator(animals[id], api)
          if (code.error) {
            return dispatch(throwError(code.error.name, (code.error.loc.line) - 1))
          }
          dispatch(startRun(code))
        }
      }
      if (action.type === abortRun.type || action.type === moveError.type) {
        let activeLine = getState().activeLine
        if (action.type === moveError.type) {
          dispatch(throwError('Move error', activeLine))
        }
        runners.forEach((runner) => {
          runner.dispose()
        })
        dispatch(stopRun())
      }
      if (action.type === stopRun.type) {
        runners = []
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
