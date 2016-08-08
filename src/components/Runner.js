import element from 'vdux/element'
import {Block, Button} from 'vdux-containers'
import {runCode} from '../middleware/codeRunner'
import {reset} from '../actions'

function render ({props}) {
  const {h, running} = props
  return (
    <Block h={h} align='center center' bgColor='white' boxShadow='0px 3px 2px -2px rgba(0,0,0,0.3)'>
      <Block w='50%' borderRight='1px solid rgba(0,0,0,0.3)'>
        <Button disabled={running} wide icon='play_arrow' fs='24px' bgColor='transparent' color='primary' p='15px' onClick={runCode}/>
      </Block>
      <Block w='50%'>
        <Button wide icon='refresh' fs='24px' bgColor='transparent' color='primary' p='15px' onClick={reset}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
