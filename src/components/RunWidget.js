/** @jsx element */

import {runCode, abortRun, pauseRun, resume} from '../middleware/codeRunner'
import {checkDrawing} from '../middleware/checkCompleted'
import {Card, Block, Icon} from 'vdux-ui'
import StepperWidget from './StepperWidget'
import SpeedDisplay from './Speed'
import element from 'vdux/element'
import {reset} from '../actions'
import Button from './Button'
import sleep from '@f/sleep'

function render ({props}) {
  const {
    hasRun, gameActions, onRun = () => {}, speed,
    animal, running, canRun, steps = 0, completed
  } = props
  const current = getSymbols(canRun, running)

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
          <Icon ml='-4px' mr='10px' name={current.icon} />
          {current.text.toUpperCase()}
        </Button>
        {canRun && <Block mt='1em' wide align='space-around center'>
          <SpeedDisplay gameActions={gameActions} speed={speed}/>
          <StepperWidget sequence={animal.sequence} steps={steps}/>
        </Block>}
      </Block>
    </Card>
  )

  function * handleClick () {
    if (!canRun) {
      return yield checkDrawing()
    }
    if (!hasRun && animal.sequence.length > 0) {
      yield runCode()
      yield onRun()
    } else if (running) {
      yield pauseRun()
    } else if (completed) {
      yield reset()
      yield sleep(500)
      yield runCode()
      yield onRun()
    } else {
      yield resume()
    }
  }
}

  function getSymbols (canRun, running) {
    if (!canRun) {
      return {
        icon: 'done',
        text: 'check'
      }
    }
    if (running) {
      return {
        icon: 'pause',
        text: 'pause'
      }
    }
    return {
      icon: 'play_arrow',
      text: 'run'
    }
  }

export default {
  render
}
