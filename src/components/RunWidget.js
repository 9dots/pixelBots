/** @jsx element */

import {runCode, abortRun} from '../middleware/codeRunner'
import {Card, Block, Icon} from 'vdux-ui'
import LinesOfCode from './LinesOfCode'
import SpeedDisplay from './Speed'
import element from 'vdux/element'
import {reset} from '../actions'
import Button from './Button'

function render ({props}) {
  const {hasRun, onRun, speed, animal} = props
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
          onClick={!hasRun ? [runCode, onRun] : [reset, () => abortRun('STOP')]}>
          <Icon ml='-4px' mr='10px' name={!hasRun ? 'play_arrow' : 'replay'} />
          {!hasRun ? 'RUN' : 'RESET'}
        </Button>
        <Block mt='1em' wide align='start center'>
          <SpeedDisplay speed={speed}/>
        </Block>
      </Block>
    </Card>
  )
}

export default {
  render
}
