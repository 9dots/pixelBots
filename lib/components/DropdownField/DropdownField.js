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
	      wide
	      borderBottom='1px solid #e0e0e0'
	      fs='m'
	      align='start center'
	      fontWeight='300'
	      p='24px'
	      hoverProps={{highlight: true}}
	      {...restProps}>
	      <Text display='block' w='25%'>{label}</Text>
	      {children}
	    </MenuItem>
	  )
  }
})
