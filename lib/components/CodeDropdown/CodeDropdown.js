/**
 * Imports
 */

import {Dropdown, MenuItem, Input} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Code Dropdown/>
 */

export default component({
  render ({props}) {
  	const {setInputType, value, btn, name} = props
	  return (
	    <Dropdown
	      btn={btn}
	      zIndex='999'
	      value={value}>
	      <Input hide name={name} value={value}/>
	      <MenuItem
	        onClick={setInputType('icons')}>
	        icons
	      </MenuItem>
	      <MenuItem
	        onClick={setInputType('code')}>
	        javascript
	      </MenuItem>
	    </Dropdown>
	  )
  }
})

