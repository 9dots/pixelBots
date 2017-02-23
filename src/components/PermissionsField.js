/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import element from 'vdux/element'
import {Toggle} from 'vdux-toggle'
import MenuItem from './MenuItem'
import {Block} from 'vdux-ui'
import Button from './Button'

const showModal = createAction('<PermissionsField/>: SHOW_MODAL')
const hideModal = createAction('<PermissionsField/>: HIDE_MODAL')

const initialState = () => ({
  modal: false
})

function render ({props, local, state}) {
  const {label, fields, onSubmit, checked = [], handleClick, ...restProps} = props
  const {modal} = state

  const footer = (
    <Block absolute top='1em' right='1em'>
      <Button ml='1em' bgColor='blue' onClick={[(e) => e.stopPropagation(), local(hideModal), onSubmit]}>X</Button>
    </Block>
  )

  const body = <Block w='285px' minWidth='285px' margin='0 auto'>
    {fields.map((field) => <Toggle
      my='8px'
      fs='l'
      bgColor='green'
      value={field}
      name={field}
      label={field}
      labelPosition='right'
      labelProps={{ml: '2em', flex: true}}
      startActive={checked.indexOf(field) > -1}
      onClick={() => handleClick(field)}
      type='checkbox' />)}
  </Block>

  return (
    <MenuItem align='center center' onClick={local(showModal)} label={label} value={checked.join(', ')} {...restProps}>
      {modal && <ModalMessage
        w='100%'
        h='100%'
        m='0'
        top='0'
        pt='5%'
        headerColor='#666'
        bgColor='#FAFAFA'
        header={label}
        noFooter
        dismiss={local(hideModal)}
        body={body}>
        {footer}
      </ModalMessage>
      }
    </MenuItem>
  )
}

const reducer = handleActions({
  [showModal.type]: (state) => ({...state, modal: true}),
  [hideModal.type]: (state) => ({...state, modal: false})
})

export default {
  initialState,
  reducer,
  render
}
