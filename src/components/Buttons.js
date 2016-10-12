/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'
import Runner from './Runner'
import IconButtons from './IconButtons'
import TextApi from './TextApi'

function render ({props}) {
  const {active, type, running, hasRun, inputType, onRun} = props

  return (
    <Block w='200px' relative bgColor='offSecondary' tall>
      <Block absolute bottom='0' wide>
        <Runner onRun={onRun} wide relative running={running} hasRun={hasRun} />
      </Block>
      <Block wide h='90%' p='10px' top='10%'>
        {inputType === 'icons'
          ? <IconButtons type={type} active={active} />
          : <TextApi type={type}/>
        }
      </Block>
    </Block>
  )
}

export default {
  render
}
