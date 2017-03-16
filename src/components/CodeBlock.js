import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props, children}) {
  const {borderColor = 'purple'} = props
  return (
    <Block border={`0px dashed ${borderColor}`} borderLeftWidth='1' pl='8px'>
      {children}
    </Block>
  )
}

export default {
  render
}
