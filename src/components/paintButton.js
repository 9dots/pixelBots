/** @jsx element */

import element from 'vdux/element'
import {Button, Icon} from 'vdux-containers'
import createAction from '@f/create-action'
import ColorPicker from './ColorPicker'

const setColor = createAction('SET_COLOR')

function initialState () {
  return {
    color: 'lightblue'
  }
}

function render ({props, state, local}) {
  const {clickHandler} = props
  const {color} = state

  const btn = (
    <Button
      h='15px'
      w='15px'
      bgColor={color}
    />
  )

  return (
    <Button relative m='5px' p='14px' bgColor='primary' onClick={() => clickHandler(color)}>
      <Icon fs='40px' name='brush'/>
      <ColorPicker btn={btn} clickHandler={local(setColor)}/>
    </Button>
  )
}

function reducer (state, action) {
  switch (action.type) {
    case setColor.type:
      return {
        ...state,
        color: action.payload
      }
  }
  return state
}

export default {
  initialState,
  render,
  reducer
}
