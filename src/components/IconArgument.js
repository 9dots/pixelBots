/** @jsx element */

import element from 'vdux/element'
import {Block, Tooltip} from 'vdux-ui'
import {Input} from 'vdux-containers'
import createAction from '@f/create-action'

const showTooltip = createAction('SHOW_TOOLTIP')
const hideTooltip = createAction('HIDE_TOOLTIP')

function initialState () {
  return {
    show: false
  }
}

function render ({props, local, state}) {
  const {type, changeHandler, argument} = props
  const {show} = state

  return (
    <Block absolute left='100%' bgColor='#333' tall w='120px' minWidth='40px' align='center center'>
      <Input
        autofocus
        mb='0'
        fs='12px'
        w='80%'
        maxWidth='100px'
        h='20px'
        color='#333'
        onMouseOver={local(showTooltip)}
        onMouseOut={local(hideTooltip)}
        inputProps={{textAlign: 'center'}}
        value={argument}
        onClick={(e) => e.stopPropagation()}
        onKeyup={keyUpHandler} />
      <Tooltip placement='bottom' show={show}>
        {type}
      </Tooltip>
    </Block>
  )

  function keyUpHandler (e) {
    const value = e.target.value === '' || isNaN(e.target.value)
      ? e.target.value
      : Number(e.target.value)
    return changeHandler(value)
  }
}

function reducer (state, action) {
  switch (action.type) {
    case showTooltip.type:
      return {
        ...state,
        show: true
      }
    case hideTooltip.type:
      return {
        ...state,
        show: false
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}
