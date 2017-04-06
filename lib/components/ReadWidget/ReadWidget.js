/**
 * Imports
 */

import GameButton from 'components/GameButton'
import Timeline from 'components/Timeline'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <Read Widget/>
 */

export default component({
  render ({props}) {
  	const {...rest} = props
  	const btnProps = {
  		flex: true,
  		mr: 's'
  	}

    return (
    	<Block bg='white' border='1px solid divider' p mt {...rest}>
	    	<Timeline />
	    	<Block align='start center' mt>
	    		<GameButton bgColor='red' {...btnProps}>
	    			<Icon name='fast_rewind'/>
	  			</GameButton>
	  			<GameButton bgColor='green' {...btnProps}>
	    			<Icon name='play_arrow'/>
	  			</GameButton>
	  			<GameButton bgColor='yellow' {...btnProps}>
	    			<Icon name='fast_forward'/>
	  			</GameButton>
	    		<GameButton {...btnProps} mr={0}>
	    			<Icon name='add'/>
	  			</GameButton>
	  		</Block>
  		</Block>
    )
  }
})
