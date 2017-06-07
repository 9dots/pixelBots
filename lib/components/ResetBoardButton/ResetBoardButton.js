/**
 * Imports
 */

import {Button} from 'vdux-containers'
import {component, element} from 'vdux'
import {Icon} from 'vdux-ui'

/**
 * <Reset Board Button/>
 */

export default component({
  render ({props}) {
  	const {active, fs, ...rest} = props
    return (
    	<Button highlight={active} {...rest}>
  			<Icon fs={fs} bolder name='replay' />
  		</Button>
    )
  }
})
