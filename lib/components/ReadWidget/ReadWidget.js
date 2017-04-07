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
	    		<GameButton {...btnProps} onClick={addFrame}>
	    			<Icon name='add'/>
	  			</GameButton>
	    		<GameButton disabled={!frames.length} bgColor='red' onClick={prevFrame} {...btnProps}>
	    			<Icon name='fast_rewind'/>
	  			</GameButton>
	  			<GameButton disabled={!frames.length} bgColor='yellow' onClick={nextFrame} {...btnProps}>
	    			<Icon name='fast_forward'/>
	  			</GameButton>
	  			<GameButton disabled={!frames.length} onClick={gameActions.validate()} bgColor='green' {...btnProps} mr={0}>
	    			<Icon name='done'/>
	  			</GameButton>
	  		</Block>
  		</Block>
    )
  }
})
