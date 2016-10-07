/** @jsx element */

import element from 'vdux/element'
import {Dropdown, MenuItem} from 'vdux-containers'

function render ({props}) {
  const {setInputType, size, btn} = props
  return (
    <Dropdown
      btn={btn}
      zIndex='999'
      value={size}>
      <MenuItem
        onClick={() => setInputType('icons')}>
        icons
      </MenuItem>
      <MenuItem
        onClick={() => setInputType('code')}>
        code
      </MenuItem>
    </Dropdown>
  )
}

export default {
  render
}
