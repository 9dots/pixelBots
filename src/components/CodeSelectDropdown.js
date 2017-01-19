/** @jsx element */

import element from 'vdux/element'
import {Dropdown, MenuItem, Input} from 'vdux-containers'

function render ({props}) {
  const {setInputType, value, btn, name} = props
  return (
    <Dropdown
      btn={btn}
      zIndex='999'
      value={value}>
      <Input hide name={name} value={value}/>
      <MenuItem
        onClick={() => setInputType('icons')}>
        icons
      </MenuItem>
      <MenuItem
        onClick={() => setInputType('code')}>
        javascript
      </MenuItem>
    </Dropdown>
  )
}

export default {
  render
}
