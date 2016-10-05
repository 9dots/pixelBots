/** @jsx element */

import SelectOptions from './SelectOptions'
import SelectAnimal from './SelectAnimal'
import DrawLevel from './DrawLevel'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

const router = enroute({
  'animal': (params, props) => <SelectAnimal {...props} />,
  'options': (params, props) => <SelectOptions {...props}/>,
  'level': (params, props) => <DrawLevel {...props} />
})

function render ({props}) {
  return (
    <Block absolute top={props.top} h='calc(100% - 60px)' wide>
      {router(props.params, props)}
    </Block>
  )
}

export default {
  render
}
