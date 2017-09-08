/**
 * Imports
 */

import GameButton from 'components/GameButton'
import {Block, Icon, Slider} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Run Widget/>
 */

export default component({
  render ({props, actions}) {
		const {
			hasRun,
			speed,
			running,
			canRun,
			steps = 0,
			completed,
      isDraft,
			hasCode,
      advanced,
			isProject,
      onComplete,
      gameActions,
			teacherBotRunning
		} = props
	  const current = getSymbols(canRun, running)
	  const btnProps = {px: 12, fs: 35}
	  const hasSubmit = !(isDraft && advanced)

	  return (
	  	<Block bgColor='white' border='1px solid divider' mt='0.5em' wide p='10px'>
	  		<Block align='center center'>
		  		<GameButton flex={!hasSubmit} maxWidth={90} disabled={teacherBotRunning || running || !hasRun } bg='red' mr='s' onClick={gameActions.reset()} py='3px' {...btnProps}>
	  				<Icon fs='inherit' bolder name='replay' />
		  		</GameButton>
		  		<GameButton  disabled={!hasCode || teacherBotRunning} bg='green' mr='s' flex onClick={actions.handleClick()} {...btnProps}>
	  				<Icon ml='-2px' fs='inherit' name={current.icon} />
		  		</GameButton>
		  		<GameButton flex={!hasSubmit} maxWidth={90} log={console.log(completed)} disabled={completed || running || !hasCode || teacherBotRunning} bg='yellow' onClick={gameActions.stepForward()} py='3px' {...btnProps}>
	  				<Icon fs='inherit' bolder name='skip_next' />
		  		</GameButton>
		  		{
		  			hasSubmit &&
			  			<GameButton disabled={running || !hasCode || teacherBotRunning} bg='blue' onClick={onComplete} h={45} fs={17} p='3px 14px' ml='s'>
			  				{isProject ? 'SUBMIT' : 'CHECK'}
		  				</GameButton>
	  			}
	  		</Block>
	  		<Block wide mt={12} align='start center'>
	  			<Block align='center center' flex>
						<Icon name='play_arrow' color='blue' fs='l' mr={-6} />
		  			<Slider
			  			handleProps={{borderRadius: 2, h: 35, w: 20, bgColor: 'blue'}}
		        	onChange={gameActions.setSpeed}
			        startValue={2}
			        min={.5}
			        max={10}
		  				mx />
	        	<Icon name='fast_forward' color='blue' w={24} fs={27} ml={-6} mr={-13} />
					</Block>
					<Block whiteSpace='nowrap' textAlign='center' p={10} w={92} border='1px solid divider' ml={30}>
       			Step: {running && speed > 8 ? '...' : steps}
     			</Block>
				</Block>
	  	</Block>
  	)
  },
  controller: {
  	* handleClick ({props}) {
  		yield props.runCode()
  	}
  }
})

function getSymbols (canRun, running) {
	if (!canRun) return ({icon: 'done', text: 'check'})
	if (running) return ({icon: 'pause', text: 'pause'})
	return ({icon: 'play_arrow', text: 'run'})
}
