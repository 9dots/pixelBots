import {throwError} from './codeRunner'
import {handleError, stopRun} from '../actions'

const stackTrace = require('stack-trace')

export default function () {
  return ({getState, dispatch}) => (next) => (action) => {
    if (action.type === throwError.type) {
      const errorLine = typeof (action.payload.lineNum) === 'number'
        ? action.payload.lineNum
        : stackTrace.parse(action.payload)[0].lineNumber - 5
      dispatch(stopRun())
      dispatch(handleError({
        message: `${action.payload.message}. Check the code at line ${errorLine + 1}.`
      }))
    }
    return next(action)
  }
}
