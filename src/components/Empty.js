import {Text, Block} from 'vdux-ui'
import element from 'vdux/element'

function render ({props, children}) {
  return (
    <Block
      bgColor='white'
      align='center center'
      h='65px'
      wide
      border='1px solid #e0e0e0'
      borderTopWidth='0'>
      <Text fs='l' fontWeight='300' color='#666'> Nothing here </Text>
      {children}
    </Block>
  )
}

export default {
  render
}
