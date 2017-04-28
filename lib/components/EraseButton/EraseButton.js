/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import EraseIcon from 'utils/icons/erase'

/**
 * <Erase Button/>
 */

export default component({
  render ({props}) {
  	const {clickHandler, active, ...rest} = props

    return (
    	<Button {...rest} ml='s' borderRadius='3px' onClick={clickHandler} highlight={active}>
  			<EraseIcon h={23} mt={2} />
  		</Button>
    )
  }
})
