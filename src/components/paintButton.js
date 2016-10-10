/** @jsx element */

import element from 'vdux/element'
import {Button, Icon, Block} from 'vdux-containers'
import createAction from '@f/create-action'
import ColorPicker from './ColorPicker'

const setColor = createAction('SET_COLOR')

function initialState () {
  return {
    color: 'offblack'
  }
}

function render ({props, state, local}) {
  const {colorPicker, clickHandler, w, h} = props
  const {color} = state

  const btn = (
    <Button
      tall
      wide
      bgColor={color}
    />
  )

  return (
    <Block wide align='center center'>
      <Button
        h={h} w={w} my='5px'
        hoverProps={{highlight: true, boxShadow: '0 2px 5px 0px rgba(0,0,0,0.6)'}}
        transition='all .3s ease-in-out'
        bgColor='primary'
        onClick={() => clickHandler(color)}
        boxShadow='0 2px 5px 0px rgba(0,0,0,0.8)'>
        <Icon color={color} mr='5px' fs='32px' name='brush'/>
        {colorPicker && <ColorPicker
          h={`${parseInt(h) / 3}px`}
          w={`${parseInt(h) / 3}px`}
          btn={btn}
          clickHandler={local(setColor)} />}
      </Button>
    </Block>
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
