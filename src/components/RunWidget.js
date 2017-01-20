/** @jsx element */

import {runCode, abortRun, pauseRun, resume} from '../middleware/codeRunner'
import {Card, Block, Icon} from 'vdux-ui'
import StepperWidget from './StepperWidget'
import SpeedDisplay from './Speed'
import element from 'vdux/element'
import {reset} from '../actions'
import Button from './Button'

function render ({props}) {
  const {hasRun, onRun = () => {}, speed, animal, running, steps = 0} = props
  console.log(running)
  return (
    <Card mt='0.5em' wide p='10px'>
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
          onClick={handleClick}>
          <Icon ml='-4px' mr='10px' name={!running ? 'play_arrow' : 'pause'} />
          {!running ? 'RUN' : 'PAUSE'}
        </Button>
        <Block mt='1em' wide align='space-around center'>
          <SpeedDisplay speed={speed}/>
          <StepperWidget steps={steps}/>
        </Block>
      </Block>
    </Card>
  )

  function * handleClick () {
    if (!hasRun && animal.sequence.length > 0) {
      yield runCode()
      yield onRun()
    } else if (running) {
      yield pauseRun()
    } else {
      yield resume()
    }
  }
}

export default {
  render
}
