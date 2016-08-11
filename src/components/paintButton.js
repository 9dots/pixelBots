import element from 'vdux/element'
import {Button, Icon, MenuItem} from 'vdux-containers'
import createAction from '@f/create-action'
import ColorDropdown from './colorDropdown'

const setColor = createAction('SET_COLOR')

const palette = [
  'lightblue',
  'green',
  'red',
  'brown',
  'black'
]

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
      <ColorDropdown
        right='-10px'
        bottom='-10px'
        btn={btn}
        absolute>
        {palette.map((name) => <MenuItem
          h='40px'
          w='40px'
          p='5px'
          m='5px'
          bgColor={name}
          boxShadow='0 0 2px 2px rgba(0,0,0,0.2)'
          onClick={[local(() => setColor(name))]}/>
        )}
      </ColorDropdown>
      <Icon fs='40px' name='brush'/>
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
