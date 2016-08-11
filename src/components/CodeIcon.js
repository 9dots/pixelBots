import element from 'vdux/element'
import {Icon, Block, wrap, CSSContainer} from 'vdux-containers'

function render ({props}) {
  let {fs, iconName, show} = props

  return (
    <Block align='center center' {...props}>
      <Icon fs={fs} name={iconName}/>
      <Icon opacity={show ? 1 : 0} color='black' absolute right='30px' name='delete'/>
    </Block>
  )
}

export default wrap(CSSContainer, {
  lingerProps: {
    show: true
  }
})({
  render
})
