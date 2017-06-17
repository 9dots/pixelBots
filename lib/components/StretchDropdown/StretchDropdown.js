/**
 * Imports
 */

import {Dropdown, MenuItem, Input} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Stretch Dropdown/>
 */

export default component({
  render ({props}) {
  	const {onSelect, value, btn, name} = props
	  return (
	  	<Block>
		    <Dropdown
		      btn={btn}
		      zIndex='999'
		      value={value}
		      fs='xs'
		      wide
		      textTransform='capitalize'>
		      <Input hide name={name} value={value}/>
		      <MenuItem onClick={onSelect(null)}>
		        None
		      </MenuItem>
		      <MenuItem onClick={onSelect('lineLimit')}>
		        Line Limit
		      </MenuItem>
		      <MenuItem onClick={onSelect('stepLimit')}>
		        Step Limit
		      </MenuItem>
		    </Dropdown>
	    </Block>
	  )
  }
})

