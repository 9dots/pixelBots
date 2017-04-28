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
  	const {icon, text, bgColor, disabled, ...rest} = props
    return (
    	<Tooltip message={text}>
	    	<Button
			    onClick={props.clickHandler()}
			    bgColor={icon ? 'transparent' : bgColor}
			    mx='4px'
			    p='4px'
			    fs={icon ? 'm' : 'xs'}
			    h={30}
			    icon={icon}
			    opacity={disabled ? .25 : 1}
			    disabled={disabled}
			    {...rest}
			    color='white'>
		    	{ 
		    		// icon && <Icon fs='m' name={icon} /> 
		    	}
		    	{ children }
			  </Button>
		  </Tooltip>
    )
  }
})
