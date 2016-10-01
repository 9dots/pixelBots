/** @jsx element */

import {swapMode} from '../actions'
import element from 'vdux/element'
import {Button} from 'vdux-containers'

function render ({props}) {
  return (
    <Button onClick={swapMode}>Swap</Button>
  )
}

export default {
  render
}
