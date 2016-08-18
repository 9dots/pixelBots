import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Delay from 'vdux-delay'

function render ({props}) {
  const {delay} = props

  return (
    <Delay time={delay}>
      <Block {...props}/>
    </Delay>
  )
}

export default {
  render
}
