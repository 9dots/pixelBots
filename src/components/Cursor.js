/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {active} = props

  return (
    <Block align='center center' {...props}>
      {active && <Block class='flashing-cursor' wide h='25%' bgColor='white'/>}
    </Block>
  )
}

export default {
  render
}
