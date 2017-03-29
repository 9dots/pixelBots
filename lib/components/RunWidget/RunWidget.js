/**
 * Imports
 */

// import {checkDrawing} from '../middleware/checkCompleted'
import StepperWidget from './StepperWidget'
import SpeedDisplay from './SpeedDisplay'
import {Card, Block, Icon} from 'vdux-ui'
import {component, element} from 'vdux'
import Button from 'components/Button'
import GameButton from 'components/GameButton'
import sleep from '@f/sleep'
import Slider from 'vdux-slider'

/**
 * <Run Widget/>
 */

export default component({
  render ({props, actions}) {
		const {hasRun, speed, running, canRun, steps = 0, completedRun, gameActions} = props
	  const current = getSymbols(canRun, running)


	  return (
	  	<Block bgColor='white' border='1px solid divider' mt='0.5em' wide p='10px'>
	  		<Block align='center center'>
		  		<GameButton disabled={running} bg='red' mr='s' onClick={gameActions.reset()} p='5px 24px'>
	  				<Icon fs={42} bolder name='replay' />
		  		</GameButton>
		  		<GameButton bg='green' mr='s' flex onClick={actions.handleClick()}>
	  				<Icon ml='-2px' fs={42} name={current.icon} />
		  		</GameButton>
		  		<GameButton disabled={running} bg='yellow' onClick={gameActions.stepForward()} p='5px 24px'>
	  				<Icon fs={42} bolder name='skip_next' />
		  		</GameButton>
	  		</Block>
	  		<Block w={250} mx='auto' mt align='center center'>
						<Icon name='play_arrow' color='blue' fs='l' />
		  			<Slider
		  				mx
			  			handleProps={{borderRadius: 2, h: 35, w: 20, bgColor: 'blue'}}
			        startValue={2}
			        min={.5}
			        max={16}
			        name='speed-slider'
		        	handleChange={gameActions.setSpeed}/>
		        <Block w={24} align='center center'>
							<Icon name='play_arrow' color='blue' fs='21' />
							<Icon name='play_arrow' color='blue' mx={-13} fs='21' />
							<Icon name='play_arrow' color='blue' fs='21' />
						</Block>
         </Block>
	  	</Block>
  	)

	  return (
	    <Block bgColor='white' border='1px solid #e6e6e6' mt='0.5em' wide p='10px'>
	      <Block column align='space-between center'>
	        <Button
	          tall
	          flex
	          wide
	          m='1px'
	          bgColor='green'
	          h='60px'
	          fs='l'
	          color='white'
	          onClick={actions.handleClick()}>
	          <Icon ml='-4px' mr='10px' name={current.icon} />
	          {current.text.toUpperCase()}
	        </Button>
	        {
	        	canRun && <Block mt='1em' wide align='space-around center'>
		          <SpeedDisplay gameActions={gameActions} speed={speed} />
		          <StepperWidget gameActions={gameActions} steps={steps} />
		        </Block>
	      	}
	      </Block>
	    </Block>
	  )
  },
  controller: {
  	* handleClick ({props}) {
  		yield props.gameActions.runCode()
  	}
  }
})

function getSymbols (canRun, running) {
	if (!canRun) return ({icon: 'done', text: 'check'})
	if (running) return ({icon: 'pause', text: 'pause'})
	return ({icon: 'play_arrow', text: 'run'})
}
 // if (!canRun) {
 //      return yield checkDrawing()
 //    }
 //    if (!hasRun && animal.sequence.length > 0) {
 //      yield runCode()
 //      yield onRun(animal.sequence)
 //    } else if (running) {
 //      yield pauseRun()
 //    } else if (completedRun) {
 //      yield reset()
 //      yield sleep(500)
 //      yield runCode()
 //      yield onRun(animal.sequence)
 //    } else {
 //      yield resume()
 // }