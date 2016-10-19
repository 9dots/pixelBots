/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'
import IconButtons from './IconButtons'
import TextApi from './TextApi'

function render ({props}) {
  const {inputType} = props

  return (
    <Block w='200px' relative bgColor='offSecondary' tall>
      <Block wide h='90%' p='10px' top='10%'>
        {inputType === 'icons'
          ? <IconButtons {...props} />
          : <TextApi {...props}/>
        }
      </Block>
    </Block>
  )
}

export default {
  render
}
