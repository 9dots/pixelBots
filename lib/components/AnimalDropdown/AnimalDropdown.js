/**
 * Imports
 */

import {Dropdown, MenuItem, Input, Tooltip, Button} from 'vdux-containers'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'
import {images} from 'animalApis'

/**
 * <AnimalDropdown/>
 */

export default component({
  render ({props}) {
	  const {clickHandler, value, btn, name} = props

	  return (
	    <Dropdown
	      btn={btn}
	      w={200}
	      zIndex='999'
	      value={value}>
	      <Input hide name={name} value={value}/>
	      {Object.keys(images).map(name => (
	        <MenuItem onClick={clickHandler(name)} fs='xs' align='start center'>
	        	<Block backgroundImage={`url(${images[name]})`} mr={10} sq={25} backgroundSize='cover' backgroundRepeat='no-repeat' />
	          <Block flex textTransform='capitalize'>{name}</Block>
	        </MenuItem>
	      ))}
	    </Dropdown>
	  )
  }
})
