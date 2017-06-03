/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import {Icon} from 'vdux-ui'
import range from '@f/range'

/**
 * <Grid Size Selector/>
 */

export default component({
  render ({props}) {
  	const {size, setSize, ...rest} = props
  	const btn = <Button {...rest} fs='xs' w='auto'>
  		Size: {size}
  		<Icon name='arrow_drop_down' mr={-2} fs='s' />
		</Button>
    
    return (
    	<Dropdown wide z={9998} maxHeight={200} overflowY='auto' btn={btn}>
    		{
    			range(2, 20).map((i) => <MenuItem onClick={setSize(i)}>{i}</MenuItem>)
    		}
    	</Dropdown>
    )
  }
})
