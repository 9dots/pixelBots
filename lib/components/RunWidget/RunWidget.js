/**
 * Imports
 */

// import {checkDrawing} from '../middleware/checkCompleted'
import StepperWidget from './StepperWidget'
import SpeedDisplay from './SpeedDisplay'
import {Card, Block, Icon, Slider} from 'vdux-ui'
import GameButton from 'components/GameButton'
import {component, element} from 'vdux'
import Button from 'components/Button'
import sleep from '@f/sleep'

/**
 * <Run Widget/>
 */

export default component({
  render ({props, actions}) {
		const {hasRun, speed, running, canRun, steps = 0, completed, setSpeed, reset, stepForward, hasCode} = props
	  const current = getSymbols(canRun, running)

	  return (
	  	<Block bgColor='white' border='1px solid divider' mt='0.5em' wide p='10px'>
	  		<Block align='center center'>
		  		<GameButton disabled={running} bg='red' mr='s' onClick={reset} p='5px 24px'>
	  				<Icon fs={42} bolder name='replay' />
		  		</GameButton>
		  		<GameButton disabled={!hasCode} bg='green' mr='s' flex onClick={actions.handleClick}>
	  				<Icon ml='-2px' fs={42} name={current.icon} />
		  		</GameButton>
		  		<GameButton disabled={running || completed || !hasCode} bg='yellow' onClick={stepForward} p='5px 24px'>
	  				<Icon fs={42} bolder name='skip_next' />
		  		</GameButton>
	  		</Block>
	  		<Block wide mt align='start center'>
	  			<Block align='center center' flex>
						<Icon name='play_arrow' color='blue' fs='l' mr={-6} />
		  			<Slider
			  			handleProps={{borderRadius: 2, h: 35, w: 20, bgColor: 'blue'}}
		        	onChange={setSpeed}
			        startValue={2}
			        min={.5}
			        max={16}
		  				mx />
		        <Block w={24} align='center center'>
							<Icon name='play_arrow' color='blue' fs='21' />
							<Icon name='play_arrow' color='blue' mx={-13} fs='21' />
							<Icon name='play_arrow' color='blue' fs='21' />
						</Block>
					</Block>
					<Block whiteSpace='nowrap' textAlign='center' p={10} w={92} border='1px solid divider' ml={30}>
       			Step: {steps}
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
