/** @jsx element */

import element from 'vdux/element'
import ColorDropdown from './ColorDropdown'
import {Block, MenuItem} from 'vdux-containers'

const palette = [
  'white',
  'deepskyblue',
  'green',
  'red',
  'brown',
  'black'
]

function render ({props, local}) {
  const {btn, clickHandler, right = '-10px', bottom = '-10px', h, w} = props

  return (
    <Block {...props}>
      <ColorDropdown h={h} w={w} btn={btn}>
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
