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
  render ({props, state}) {
  	const {gameActions, frames, frameNumber, correctness, ...rest} = props
  	const {nextFrame, prevFrame, addFrame, setFrame, removeFrame} = gameActions
  	const btnProps = {
  		flex: true,
  		mr: 's'
  	}

    return (
    	<Block bg='white' border='1px solid divider' p my {...rest}>
	    	<Timeline frames={frames} frameNumber={frameNumber} onClick={setFrame} remove={removeFrame} correctness={correctness} />
	    	<Block align='start center' mt>
	    		<GameButton bgColor='red' onClick={prevFrame} {...btnProps}>
	    			<Icon name='fast_rewind'/>
	  			</GameButton>
	  			<GameButton bgColor='yellow' onClick={nextFrame} {...btnProps}>
	    			<Icon name='fast_forward'/>
	  			</GameButton>
	  			<GameButton onClick={gameActions.validate()} bgColor='green' {...btnProps}>
	    			<Icon name='done'/>
	  			</GameButton>
	    		<GameButton {...btnProps} mr={0} onClick={addFrame}>
	    			<Icon name='add'/>
	  			</GameButton>
	  		</Block>
  		</Block>
    )
  }
})
