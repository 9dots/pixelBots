import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import {removeLine} from '../actions'

function render ({props}) {
  const {turtles, active, activeLine, running} = props

  const code = turtles[active].sequence.map((line, i) => {
    const isActive = activeLine === i && running
    return <Text
      wide
      p='0 2px'
      background={isActive ? '#8fa5c9' : 'transparent'}
      cursor='pointer'
      onClick={() => removeLine(active, i)}>
        {line}
      </Text>
  })

  return (
    <Block wide p='22px' fs='22px' fontFamily='Monaco' color='white' column>
      {code}
    </Block>
  )
}

export default {
  render
}
