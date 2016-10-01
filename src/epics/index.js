import { combineEpics } from 'redux-observable'
import runner from './runner'

export default combineEpics(
  runner
)
