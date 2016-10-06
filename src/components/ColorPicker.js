/** @jsx element */

import element from 'vdux/element'
import ColorDropdown from './ColorDropdown'
import {Block, MenuItem, Flex} from 'vdux-containers'

const palette = [
  'white',
  'deepskyblue',
  'green',
  'red',
  'brown',
  'black'
]

const colorBlockSize = {
  side: 40,
  margin: 5
}

function render ({props, local}) {
  const {btn, clickHandler, h, w, column, row} = props
  const menuWidth = (palette.length * colorBlockSize.side) + (palette.length * (colorBlockSize.margin * 2))

  return (
    <Block {...props}>
      <ColorDropdown menuWidth={menuWidth} h={h} w={w} btn={btn}>
        <Flex relative column={column} row={row} align='center center' >
          {palette.map((name) => <MenuItem
            sq={`${colorBlockSize.side}px`}
            p='5px'
            m={`${colorBlockSize.margin}px`}
            bgColor={name}
            boxShadow='0 0 2px 2px rgba(0,0,0,0.2)'
            onClick={() => clickHandler(name)}/>
          )}
        </Flex>
      </ColorDropdown>
    </Block>
  )
}

export default {
  render
}
