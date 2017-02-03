import ModalMessage from './ModalMessage'
import {clearMessage} from '../actions'
import element from 'vdux/element'
import Button from './Button'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {action, dismiss, header, message} = props
  const footer = <Block>
    <Button bgColor='secondary' onClick={dismiss}>Cancel</Button>
    <Button ml='1em' bgColor='red' onClick={[dismiss, action]}>Accept</Button>
  </Block>

  return (
    <ModalMessage
      header={header}
      body={`Are you sure you want to ${message}`}
      dismiss={dismiss}
      footer={footer} />
  )
}

export default {
  render
}
