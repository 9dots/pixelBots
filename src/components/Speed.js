/** @jsx element */

import {Block, Text} from 'vdux-ui'
import element from 'vdux/element'
import {setSpeed} from '../actions'
import Button from './Button'

function render ({props}) {
  const {speed, ...restProps} = props
  const isMaxSpeed = speed >= 8
  const isMinSpeed = speed <= 0.25

  return (
    <Block column align='center center' {...restProps}>
      <Block>
        <Text
          color='green'
          display='block'
          fs='m'
          fontWeight='300'>SPEED</Text>
      </Block>
      <Block h='35px' align='center center'>
        <Button
          bgColor='white'
          w='28px'
          px='8px'
          disabled={isMinSpeed}
          fontWeight='800'
          borderWidth='0'
          color={isMinSpeed ? 'grey' : 'green'}
          onClick={() => decreaseSpeed(speed)}>-</Button>
        <Text
          w='60px'
          textAlign='center'
          color='green'
          display='block'
          fs='m'
          fontWeight='300'>{speed}x</Text>
        <Button
          bgColor='white'
          w='28px'
          px='8px'
          disabled={isMaxSpeed}
          fontWeight='800'
          borderWidth='0'
          color={isMaxSpeed ? 'grey' : 'green'}
          onClick={() => increaseSpeed(speed)}>+</Button>
      </Block>
    </Block>
  )
}

function * decreaseSpeed (speed) {
  if (speed > 0.25) {
    yield setSpeed(speed / 2)
  }
}

function * increaseSpeed (speed) {
  if (speed < 8) {
    yield setSpeed(speed * 2)
  }
}

export default {
  render
}
