/** @jsx element */

import element from 'vdux/element'
import animalDescriptions from '../animalApis/animalDescriptions'
import {Dropdown, MenuItem, Input} from 'vdux-containers'

function render ({props}) {
  const {clickHandler, value, btn, name} = props
  return (
    <Dropdown
      btn={btn}
      zIndex='999'
      value={value}>
      <Input hide name={name} value={value}/>
      {Object.keys(animalDescriptions).map((name) => (
        <MenuItem
          onClick={() => clickHandler(name)}>
          {name}
        </MenuItem>
      ))}
    </Dropdown>
  )
}

export default {
  render
}
