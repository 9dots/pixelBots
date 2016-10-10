import * as turtle from './turtleAPI'
import * as zebra from './zebraAPI'
import * as panda from './pandaAPI'
import * as toucan from './toucanAPI'

export default {
  turtle: turtle.default,
  zebra: zebra.default,
  panda: panda.default,
  toucan: toucan.default,
  docs: {
    turtle: turtle.docs,
    zebra: zebra.docs,
    panda: panda.docs,
    toucan: toucan.docs
  }
}
