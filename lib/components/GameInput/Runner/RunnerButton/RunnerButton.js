/**
 * Imports
 */

import {component, element} from 'vdux'
import {Tooltip} from 'vdux-containers'
import Button from 'components/Button'
import {Icon} from 'vdux-ui'

/**
 * <Runner Button/>
 */

export default component({
  render ({props, actions, children}) {
  	const {icon, text, bgColor, ...rest} = props
    return (
    	<Tooltip message={text}>
	    	<Button
			    onClick={props.clickHandler()}
			    bgColor={bgColor}
			    color='white'
			    mx='4px'
			    p='4px'
			    fs='xs'
			    h={30}
			    {...rest}>
		    	{ icon && <Icon fs='m' name={icon} /> }
		    	{ children }
			  </Button>
		  </Tooltip>
    )
  }
})
