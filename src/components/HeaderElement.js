import {Block, Icon, Image, Text} from 'vdux-containers'
import element from 'vdux/element'
import omit from '@f/omit'

function render ({props, children}) {
  const {handleClick, background, icon, text, image, active, ...restProps} = props
  return (
    <Block
      column
      align='center center'
      my='18px'
      cursor='pointer'
      onClick={handleClick}
      color={active ? '#404040' : '#767676'}
      hoverProps={{color: '#404040'}}
      transition={'all .3s ease-in-out'}
      relative
      {...restProps}>
      <Block
        display='inline-block'
        bgColor='transparent'
        cursor='pointer'
        align='center center'>
        {image && <Image src={image} sq='50px' margin='auto'/>}
        {icon && <Icon name={icon} fs='30px'/>}
      </Block>
      {text && <Text mt='8px' fs='xxs' fontWeight='600'>{text}</Text>}
      {children}
    </Block>
  )
}

export default {
  render
}