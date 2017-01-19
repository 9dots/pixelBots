/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditModal from './EditModal'
import element from 'vdux/element'
import MenuItem from './MenuItem'
const showModal = createAction('<EditableTextField/>: SHOW_MODAL')
const hideModal = createAction('<EditableTextField/>: HIDE_MODAL')

const initialState = () => ({
  modal: false
})

function render ({props, local, state}) {
  const {label, field, value, onSubmit, validate, textarea, ...restProps} = props
  const {modal} = state

  return (
    <MenuItem align='center center' onClick={local(showModal)} label={label} value={value} {...restProps}>
      {modal && <EditModal
        field={field}
        validate={validate}
        textarea={textarea}
        value={value}
        onSubmit={onSubmit}
        dismiss={local(hideModal)}
        label={label}/>}
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
