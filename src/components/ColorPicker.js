/** @jsx element */

import element from 'vdux/element'
import ColorDropdown from './colorDropdown'
import {Block, MenuItem} from 'vdux-containers'

const palette = [
  'lightblue',
  'green',
  'red',
  'brown',
  'black'
]

function render ({props, local}) {
  const {btn, clickHandler, right = '-10px', bottom = '-10px'} = props

  return (
    <Block absolute right={right} bottom={bottom}>
      <ColorDropdown btn={btn}>
        {palette.map((name) => <MenuItem
          h='40px'
          w='40px'
          p='5px'
          m='5px'
          bgColor={name}
          boxShadow='0 0 2px 2px rgba(0,0,0,0.2)'
          onClick={() => clickHandler(name)}/>
        )}
      </ColorDropdown>
    </Block>
  )
}

export default {
  render
}
