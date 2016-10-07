/** @jsx element */

import element from 'vdux/element'
import {CSSContainer, wrap} from 'vdux-containers'
import {Text, Tooltip} from 'vdux-ui'

function render ({props}) {
  const {tool, show} = props
  console.log(tool.description)
  return (
    <Text cursor='zoom-in' fontFamily='code' fw='300' fs='l' pr='10px'>
      {tool.usage}
      <Tooltip
        placement='right'
        whiteSpace='wrap'
        bgColor='white'
        color='black'
        show={show}
        w='200px'
        fs='m'>
        {tool.description}
      </Tooltip>
    </Text>
  )
}


export default wrap(CSSContainer, {
  lingerProps: {
    show: true
  }
})({
  render
})
