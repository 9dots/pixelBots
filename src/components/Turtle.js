import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  let {dir} = props
  return (
    <Block h='50%' w='50%' bgColor='green'/>
  )
}

export default {
  render
}
