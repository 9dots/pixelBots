/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import EditLevelModal from './EditLevelModal'
import element from 'vdux/element'
import MenuItem from './MenuItem'
const showModal = createAction('<EditableLevelItem/>: SHOW_MODAL')
const hideModal = createAction('<EditableLevelItem/>: HIDE_MODAL')

const initialState = () => ({
  modal: false
})

function render ({props, local, state}) {
  const {
    label,
    title,
    field,
    value,
    game,
    colorPicker,
    onSubmit,
    painted,
    validate,
    clickHandler,
    ...restProps
  } = props
  const {modal} = state

  return (
    <MenuItem align='center center' onClick={local(showModal)} label={label} value={value} {...restProps}>
      {modal && <EditLevelModal
        field={field}
        validate={validate}
        value={value}
        painted={painted}
        onSubmit={onSubmit}
        clickHandler={clickHandler}
        colorPicker={colorPicker}
        game={game}
        dismiss={local(hideModal)}
        title={title}
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
