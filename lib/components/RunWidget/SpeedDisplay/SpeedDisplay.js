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
	  const disabledProps = {
  		disabled: true,
  		cursor: 'normal',
  		color: 'grey',
  		bgColor: 'transparent'
  	}
	  const minProps = speed <= 0.25 ? disabledProps : {}
	  const maxProps = speed >= 16 ? disabledProps : {}

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
	          onClick={gameActions.setSpeed(speed / 2)}
	          fontWeight='800'
	          borderWidth='0'
	          bgColor='white'
	          color='green'
	          w='28px'
	          px='8px'
	          {...minProps}>
		          <Icon name='remove'/>
	          </Button>
	        <Text
	          w='60px'
	          textAlign='center'
	          color='green'
	          display='block'
	          fs='m'
	          fontWeight='300'>{speed}x</Text>
	        <Button
	          onClick={gameActions.setSpeed(speed * 2)}
	          fontWeight='800'
	          bgColor='white'
	          borderWidth='0'
	          color='green'
	          w='28px'
	          px='8px'
	          {...maxProps}>
	          <Icon name='add'/>
          </Button>
	      </Block>
	    </Block>
	  )
  }
})
