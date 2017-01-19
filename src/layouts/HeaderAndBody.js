/** @jsx element */

import {Avatar, Block, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props, children}) {
  const {title, titleImg, titleActions, category, leftAction} = props
  return (
    <Block id='top' column wide tall>
      <Block relative wide color='#666' fontWeight='800'>
        <Block align='start center' pb='10px'>
          {leftAction ? leftAction : <Block ml='1em'/>}
          {titleImg && <Avatar boxShadow='0 0 1px 2px rgba(0,0,0,0.2)' h='70px' w='70px' src={titleImg} />}
          <Block flex relative ml='1em'>
            {category && <Text display='block' fontWeight='300' fs='xs'>{category.toUpperCase()}</Text>}
            <Text display='block' fontWeight='500' fs='xl'>{title}</Text>
          </Block>
          {titleActions}
        </Block>
      </Block>
      <Block flex wide py='1em'>
        {children}
      </Block>
    </Block>
  )
}

export default {
  render
}
