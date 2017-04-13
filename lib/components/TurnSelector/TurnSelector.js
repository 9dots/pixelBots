/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import {Icon, Block} from 'vdux-ui'

/**
 * <Turn Selector/>
 */

export default component({
  render ({props, actions}) {
  	const {turn} = actions

  	const btn = (
  		<Button {...props} bgColor='#FAFAFA' border='1px solid #CACACA' h={40} color='#111'>
    		<Icon name='rotate_90_degrees_ccw' />
  		</Button>
		)

    return (
    	<Dropdown btn={btn} left>
    		<Block align='start center'>
	    		<MenuItem onClick={turn(270)}>
	    			<Icon name='arrow_upward'/>
	    		</MenuItem>
	    		<MenuItem onClick={turn(0)}>
	    			<Icon name='arrow_forward'/>
	    		</MenuItem>
	    		<MenuItem onClick={turn(90)}>
	    			<Icon name='arrow_downward'/>
	    		</MenuItem>
	    		<MenuItem onClick={turn(180)}>
	    			<Icon name='arrow_back'/>
	    		</MenuItem>
    		</Block>
    	</Dropdown>
    )
  },
  controller: {
  	* turn ({props}, dir) {
  		const {clickHandler, rot} = props
  		if(dir !== rot)
    		yield clickHandler(dir - rot)
    }
  }
})
