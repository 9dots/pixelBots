import {Block, Icon, Text} from 'vdux-ui'
import element from 'vdux/element'
import omit from '@f/omit'

function render ({props}) {
  const {handleClick, background, icon, text, ...restProps} = props
  return (
    <Block my='20px' cursor='pointer' onClick={handleClick} relative {...restProps}>
      <Block
        h='40px'
        w='40px'
        display='inline-block'
        bgColor='transparent'
        color='white'
        cursor='pointer'
        align='center center'
        background={background && background}
        backgroundSize='contain'>
        {icon && <Icon name={icon} transition={'all .3s ease-in-out'} fs='30px'/>}
      </Block>
      <Text w='150px' absolute color='white' fs='m' top='7px' left='63px'>{text}</Text>
    </Block>
  )
}

export default {
  render
}