/**
 * Imports
 */

import {component, element} from 'vdux'
import {MenuItem, Text, Block} from 'vdux-ui'

/**
 * <Dropdown Field/>
 */

export default component({
  render ({props, children}) {
	  const {label, disabled, ...restProps} = props

	  return (
	    <MenuItem
	    	pointerEvents={disabled ? 'none' : 'all'}
	      fontWeight='300'
	      cursor='default'
	      {...restProps}
	      px={24}
	      py>
	      <Block opacity={disabled ? .5 : 1} align='start center' wide>
		      <Text display='block' w='25%'>{label}</Text>
		      {children}
	      </Block>
	    </MenuItem>
	  )
  }
})
