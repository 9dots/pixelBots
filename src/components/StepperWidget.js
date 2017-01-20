/** @jsx element */

import Button from './Button'
import {Block, Icon, Text} from 'vdux-ui'
import element from 'vdux/element'
import {reset} from '../actions'
import {pauseRun, stepForward} from '../middleware/codeRunner'

function render ({props}) {
  const {steps, ...restProps} = props
  return (
  	<Block column align='center center' {...restProps}>
      <Block>
        <Text
          color='green'
          display='block'
          fs='m'
          fontWeight='300'>STEPPER</Text>
      </Block>
      <Block h='35px' align='center center'>
        <Button
          bgColor='white'
          w='28px'
          px='8px'
          fontWeight='800'
          borderWidth='0'
          color='green'
          onClick={reset}><Icon name='replay'/></Button>
        <Text
          w='60px'
          textAlign='center'
          color='green'
          display='block'
          fs='m'
          fontWeight='300'>{steps}</Text>
        <Button
          bgColor='white'
          w='28px'
          px='8px'
          fontWeight='800'
          borderWidth='0'
          color='green'
          onClick={stepForward}><Icon name='skip_next'/></Button>
      </Block>
    </Block>
  )
}

export default {
  render
}
