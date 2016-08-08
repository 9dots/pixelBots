import createAction from '@f/create-action'

const turtleForward = createAction('TURTLE_FORWARD', (id) => id)
const turtleTurnRight = createAction('TURTLE_TURN_RIGHT', (id) => id)
const turtleTurnLeft = createAction('TURTLE_TURN_LEFT', (id) => id)
const turtlePaint = createAction('TURTLE_PAINT', (id) => id)
const turtleErase = createAction('TURTLE_ERASE', (id) => id)
const turtleMove = createAction('TURTLE_MOVE', (id, location) => ({location, id}))
const setActive = createAction('SET_TURTLE_ACTIVE', (id) => id)
const addCode = createAction('ADD_CODE', (id, fn) => ({id, fn}))
const reset = createAction('RESET', (id) => id)
const removeLine = createAction('REMOVE_LINE', (id, idx) => ({id, idx}))
const startRun = createAction('START_RUN')
const stopRun = createAction('STOP_RUN')
const moveError = createAction('MOVE_ERROR')
const setActiveLine = createAction('SET_ACTIVE_LINE', (idx) => idx)

export {
  turtleForward,
  turtleTurnRight,
  turtleTurnLeft,
  turtleErase,
  turtlePaint,
  turtleMove,
  setActive,
  addCode,
  reset,
  removeLine,
  startRun,
  stopRun,
  setActiveLine,
  moveError
}
