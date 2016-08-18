import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {focus} = props

  return (
    <Block {...props}/>
  )
}

export default {
  render
}
