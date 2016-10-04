/** @jsx element */

import element from 'vdux/element'
import {Button} from 'vdux-containers'

function render ({props, children}) {
  return (
    <Button fs='18px' p='6px 18px' {...props}>{children}</Button>
  )
}

export default {
  render
}
