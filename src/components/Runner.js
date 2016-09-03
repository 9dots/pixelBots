/** @jsx element */

import element from 'vdux/element'
import {Block, Button} from 'vdux-containers'
import {runCode, abortRun} from '../middleware/codeRunner'
import {reset} from '../actions'

function render ({props}) {
  const {hasRun} = props
  return (
    <Block {...props} align='center center' bgColor='primary' hoverProps={{highlight: true}} transition='all .3s ease-in-out' boxShadow='0px 2px 5px -2px rgba(0,0,0,0.4)'>
      {!hasRun
        ? <Button wide icon='play_arrow' fs='24px' color='white' p='15px' onClick={runCode}/>
        : <Button wide icon='refresh' fs='24px' color='white' p='15px' onClick={[reset, () => abortRun('STOP')]}/>
      }
    </Block>
  )
}

export default {
  render
}
