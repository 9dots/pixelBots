import {Block, Icon, Image, Text} from 'vdux-containers'
import element from 'vdux/element'
import omit from '@f/omit'

function render ({props}) {
  const {handleClick, background, icon, text, image, active, ...restProps} = props
  return (
    <Block
      column
      align='center center'
      my='25px'
      cursor='pointer'
      onClick={handleClick}
      color={active ? '#f5f5f5' : 'disabled'}
      hoverProps={{color: '#fff'}}
      transition={'all .3s ease-in-out'}
      relative
      {...restProps}>
      <Block
        display='inline-block'
        bgColor='transparent'
        cursor='pointer'
        align='center center'>
        {image && <Image src={image} sq='50px' margin='auto'/>}
        {icon && <Icon name={icon} fs='34px'/>}
      </Block>
      {text && <Text mt='8px' fs='xs' fontWeight='600'>{text}</Text>}
    </Block>
  )
}

export default {
  render
}