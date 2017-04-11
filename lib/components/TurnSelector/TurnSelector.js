/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import {Icon} from 'vdux-ui'

/**
 * <Turn Selector/>
 */

export default component({
  render ({props}) {
  	const {...rest} = props

  	const btn = (
  		<Button {...rest} bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111'>
    		<Icon name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown btn={btn}>
    		<MenuItem>
    			Tots
    		</MenuItem>
    	</Dropdown>
    )
  }
})
