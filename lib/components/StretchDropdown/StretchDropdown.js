/**
 * Imports
 */

import {Dropdown, MenuItem, Input} from 'vdux-containers'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import {Block} from 'vdux-ui'

/**
 * <Stretch Dropdown/>
 */

export default component({
  render ({props}) {
  	const {onSelect, value, btn, name, options = {}} = props
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
          {
            mapValues(({label, indicator}, key) => (
              <MenuItem onClick={onSelect(key)}>
                {label} Limit
              </MenuItem>
            ), options)
          }
		    </Dropdown>
	    </Block>
	  )
  }
})
