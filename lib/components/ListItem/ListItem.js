/**
 * Imports
 */

import {MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <List Item/>
 */

export default component({
  render ({props, children}) {
    return (
    	<MenuItem 
    		hoverProps={{bgColor: 'highlightBlue'}} 
    		border='1px solid divider'
    		mb={-1}
    		{...props}>
    		{children}
    	</MenuItem>
    )
  }
})
