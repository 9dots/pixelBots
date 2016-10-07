/** @jsx element */

import element from 'vdux/element'
import ModalMessage from './ModalMessage'

function render ({props}) {
  const {message, lineNumber} = props
  const body = `Check the code at line number ${lineNumber}`

  return (
    <ModalMessage header={message} body={body}/>
  )
}

export default {
  render
}
