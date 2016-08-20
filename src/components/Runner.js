/** @jsx element */

import element from 'vdux/element'
import {Block, Button} from 'vdux-containers'
import {runCode, abortRun} from '../middleware/codeRunner'
import {reset} from '../actions'

function render ({props}) {
  const {running} = props
  return (
    <Block {...props} align='center center' bgColor='primary' boxShadow='0px 2px 5px -2px rgba(0,0,0,0.4)'>
      <Block w='50%' borderRight='1px solid rgba(0,0,0,0.3)'>
        <Button hoverProps={{highlight: true}} disabled={running} wide icon='play_arrow' fs='24px' bgColor='transparent' color='white' p='15px' onClick={runCode}/>
      </Block>
      <Block w='50%'>
        <Button wide icon='refresh' fs='24px' bgColor='transparent' color='white' p='15px' onClick={[reset, () => abortRun('STOP')]}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
