import { combineEpics } from 'redux-observable'
import runner from './runner'
import runOver from './runOver'

export default combineEpics(
  runner
  // runOver
)
