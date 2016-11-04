import createAction from '@f/create-action'
import getIterator from '../getIterator.js'
import animalApis from '../animalApis'
import {
  throwError,
  moveError,
  startRun,
  stopRun
} from '../actions'

const runCode = createAction('RUN_CODE')
const abortRun = createAction('ABORT_RUN')

function codeRunner () {
  return ({getState, dispatch}) => {
    return (next) => (action) => {
      let state = getState()
      if (action.type === runCode.type && !state.running) {
        const {animals} = state.game
        for (var id in animals) {
          const api = animalApis[animals[id].type].default(id, getState)
          console.log(animals[id].sequence)
          let code = getIterator(animals[id], api, id)
          if (code.error) {
            return dispatch(
              throwError(code.error.name, (code.error.loc.line) - 1)
            )
          }
          dispatch(startRun(code))
        }
      }
      if (action.type === abortRun.type || action.type === moveError.type) {
        dispatch(stopRun())
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
