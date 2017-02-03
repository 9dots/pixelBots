/** @jsx element */

import ModalMessage from './ModalMessage'
import Description from './Description'
import element from 'vdux/element'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'
import {Block} from 'vdux-ui'

function render ({props, state, local}) {
  const {show, content, btn, saveDocumentation, title, dismiss} = props

  return (
    <Block>
      {show && <ModalMessage
        fullscreen
        noFooter
        bgColor='#e5e5e5'
        header={title}
        headerColor='#666'
        dismiss={dismiss}
        body={<Description saveDocumentation={saveDocumentation} content={content}/>}/>}
    </Block>
  )
}

export default {
  render
}
