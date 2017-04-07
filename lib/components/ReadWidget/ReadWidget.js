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
  	const {gameActions, frames, frameNumber, ...rest} = props
  	const {nextFrame, prevFrame, addFrame, setFrame} = gameActions
  	const btnProps = {
  		flex: true,
  		mr: 's'
  	}

    return (
    	<Block bg='white' border='1px solid divider' p my {...rest}>
	    	<Timeline frames={frames} frameNumber={frameNumber} onClick={setFrame} />
	    	<Block align='start center' mt>
	    		<GameButton bgColor='red' onClick={prevFrame} {...btnProps}>
	    			<Icon name='fast_rewind'/>
	  			</GameButton>
	  			<GameButton onClick={gameActions.validate()} bgColor='green' {...btnProps}>
	    			<Icon name='play_arrow'/>
	  			</GameButton>
	  			<GameButton bgColor='yellow' onClick={nextFrame} {...btnProps}>
	    			<Icon name='fast_forward'/>
	  			</GameButton>
	    		<GameButton {...btnProps} mr={0} onClick={addFrame}>
	    			<Icon name='add'/>
	  			</GameButton>
	  		</Block>
  		</Block>
    )
  }
})
