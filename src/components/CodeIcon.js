import element from 'vdux/element'
import {Icon, Block} from 'vdux-ui'

function render ({props}) {
  let {fs, iconName} = props

  return (
    <Block align='center center' {...props}>
      <Icon fs={fs} name={iconName}/>
    </Block>
  )
}

export default {
  render
}
