import createAction from '@f/create-action'

const turtleForward = createAction('TURTLE_FORWARD', (id) => id)
const turtleTurnRight = createAction('TURTLE_TURN_RIGHT', (id) => id)
const turtlePaint = createAction('TURTLE_PAINT', (id) => id)

export {
  turtleForward,
  turtleTurnRight,
  turtlePaint
}
