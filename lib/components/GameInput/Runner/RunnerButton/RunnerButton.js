/**
 * Imports
 */

import {component, element} from 'vdux'
import Button from 'components/Button'
import {Icon} from 'vdux-ui'

/**
 * <Runner Button/>
 */

export default component({
  render ({props, actions}) {
  	const {icon, text, bgColor} = props
    return (
    	<Button
		    tall
		    flex
		    bgColor={bgColor}
		    p='4px'
		    wide
		    mx='4px'
		    fs='s'
		    color='white'
		    align='center center'
		    onClick={props.clickHandler()}>
		    <Icon fs='m' name={icon} />
		  </Button>
    )
  }
})
