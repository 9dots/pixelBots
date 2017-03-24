/**
 * Imports
 */

import animalDescriptions from 'animalApis/animalDescriptions'
import {Dropdown, MenuItem, Input} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Animal Dropdown/>
 */

export default component({
  render ({props}) {
	  const {clickHandler, value, btn, name} = props
	  return (
	    <Dropdown
	      btn={btn}
	      wide
	      zIndex='999'
	      value={value}
	      textTransform='capitalize'>
	      <Input hide name={name} value={value}/>
	      {Object.keys(animalDescriptions).map((name) => (
	        <MenuItem onClick={clickHandler(name)} fs='s'>
	          {name}
	        </MenuItem>
	      ))}
	    </Dropdown>
	  )
  }
})