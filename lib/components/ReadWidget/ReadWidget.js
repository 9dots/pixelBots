/**
 * Imports
 */

import GameButton from 'components/GameButton'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <Read Widget/>
 */

export default component({
  render ({props, state}) {
  	const {gameActions, frames, frameNumber, correctness, ...rest} = props
  	const {nextFrame, prevFrame, addFrame, setFrame, removeFrame} = gameActions
  	const btnProps = {
  		flex: true,
  		mr: 's'
  	}

    return (
    	<Block bg='white' border='1px solid divider' p my {...rest}>
	    	<Block align='start center' mt>
	    		<GameButton {...btnProps} bgColor='red' onClick={addFrame}>
	    			<Icon name='delete'/>
	  			</GameButton>
	    		<GameButton onClick={prevFrame} {...btnProps}>
	    			<Icon name='fast_rewind'/>
	  			</GameButton>
	  			<GameButton  bgColor='yellow' onClick={nextFrame} {...btnProps}>
	    			<Icon name='fast_forward'/>
	  			</GameButton>
	  			<GameButton onClick={gameActions.validate()} bgColor='green' {...btnProps} mr={0}>
	    			<Icon name='done'/>
	  			</GameButton>
	  		</Block>
  		</Block>
    )
  }
})
