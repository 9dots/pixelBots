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
	      align='start center'
	      fontWeight='300'
	      {...restProps}
	      px={24}
	      py
	      cursor='default'>
	      <Text display='block' w='25%'>{label}</Text>
	      {children}
	    </MenuItem>
	  )
  }
})
