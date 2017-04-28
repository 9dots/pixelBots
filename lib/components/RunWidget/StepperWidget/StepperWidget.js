/**
 * Imports
 */

import {Block, Icon, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'

/**
 * <Stepper Widget/>
 */

export default component({
  render ({props}) {
	  const {steps, gameActions, ...restProps} = props

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
	          onClick={gameActions.reset()}><Icon name='replay' /></Button>
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
	          onClick={gameActions.stepForward()}><Icon name='skip_next' /></Button>
	      </Block>
	    </Block>
	  )
  }
})
