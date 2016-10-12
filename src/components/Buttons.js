/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'
import IconButtons from './IconButtons'
import TextApi from './TextApi'

function render ({props}) {
  const {active, type, inputType} = props

  return (
    <Block w='200px' relative bgColor='offSecondary' tall>
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
