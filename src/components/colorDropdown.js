/** @jsx element */

/**
 * Imports
 */

import combineReducers from '@f/combine-reducers'
import {Dropdown, DropdownMenu, Box} from 'vdux-ui'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import element from 'vdux/element'

/**
 * initialState
 */

function initialState () {
  return {
    open: false
  }
}

/**
 * Render dropdown component
 */

function render ({props, state, local, children}) {
  const {open} = state
  const {btn, closeOnEsc = true, disabled, menuWidth} = props
  const api = {toggle: local(toggle), close: local(close)}

  if (props.ref) props.ref(api)
  if (!props.btn) throw new Error('Forgot to pass required `btn` prop to <Dropdown/>')

  return (
    <Dropdown relative {...props} onKeyup={{esc: closeOnEsc && api.close}}>
      {
        typeof btn === 'function'
          ? btn(api, open)
          : <Box tag='span' wide tall onClick={[(e) => e.stopPropagation(), !disabled && api.toggle]} pointer={!disabled}>{btn}</Box>
      }
      <DropdownMenu
        onClick={[(e) => e.stopPropagation(), !disabled && api.toggle]}
        right={`-${menuWidth / 2 - (parseInt(props.w) / 2)}px`}
        onDismiss={[api.close, props.onDismiss]}
        zIndex='999'
        open={open}>
        {children}
      </DropdownMenu>
    </Dropdown>
  )
}

/**
 * Actions
 */

const toggle = createAction('<Dropdown/>: toggle')
const close = createAction('<Dropdown/>: close')

/**
 * Reducer
 */

const reducer = combineReducers({
  open: handleActions({
    [toggle]: (state) => !state,
    [close]: () => false
  })
})

/**
 * Exports
 */

export default {
  initialState,
  render,
  reducer
}
