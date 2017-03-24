/**
 * Imports
 */

import {component, element} from 'vdux'
import {MenuItem, Text} from 'vdux-ui'

/**
 * <Dropdown Field/>
 */

export default component({
  render ({props, children}) {
	  const {label, ...restProps} = props
	  return (
	    <MenuItem
	      borderBottom='1px solid #e0e0e0'
	      align='start center'
	      fontWeight='300'
	      px={24}
	      py
	      {...restProps}>
	      <Text display='block' w='25%'>{label}</Text>
	      {children}
	    </MenuItem>
	  )
  }
})
