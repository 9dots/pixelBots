/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'

/**
 * <Button/>
 */

export default component({
  render ({props, children}) {
	  return (
	    <Button fs='18px' p='6px 18px' {...props}>{children}</Button>
	  )
  }
})
