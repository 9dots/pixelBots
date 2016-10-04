/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {Button} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'

function render ({props}) {
  return (
    <Block>
      Select Options
      <Button onClick={() => setUrl('/create/level')}>Next</Button>
    </Block>
  )
}

export default {
  render
}
