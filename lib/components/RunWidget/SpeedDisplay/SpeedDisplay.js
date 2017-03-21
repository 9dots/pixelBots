/**
 * Imports
 */

import {Block, Icon, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'

/**
 * <Speed Display/>
 */

export default component({
  render ({props}) {
	  const {speed, gameActions, ...restProps} = props
	  const isMaxSpeed = speed >= 16
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
	          onClick={gameActions.decreaseSpeed}><Icon name='remove'/></Button>
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
	          onClick={gameActions.increaseSpeed}><Icon name='add'/></Button>
	      </Block>
	    </Block>
	  )
  }
})
