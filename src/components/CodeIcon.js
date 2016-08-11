/** @jsx element */

import element from 'vdux/element'
import {Icon, Block, wrap, CSSContainer} from 'vdux-containers'
import ColorDropdown from './colorDropdown'
import {removeLine} from '../actions'

function render ({props}) {
  let {fs, iconName, show, lineNum, id} = props

  return (
    <Block align='center center' {...props}>
      <Icon fs={fs} name={iconName}/>
      <Icon
        opacity={show ? 1 : 0}
        onClick={() => removeLine(id, lineNum)}
        transition='opacity .3s ease-in-out'
        color='black'
        absolute
        right='8%'
        name='delete'/>
    </Block>
  )
}

export default wrap(CSSContainer, {
  hoverProps: {
    show: true
  }
})({
  render
})
