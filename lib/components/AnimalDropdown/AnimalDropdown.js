/**
 * Imports
 */

import animalDescriptions from 'animalApis/animalDescriptions'
import {Dropdown, MenuItem, Input, Tooltip} from 'vdux-containers'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <Animal Dropdown/>
 */

export default component({
  render ({props}) {
	  const {clickHandler, value, btn, name} = props

	  return (
	    <Dropdown
	      btn={btn}
	      wide
	      zIndex='999'
	      value={value}>
	      <Input hide name={name} value={value}/>
	      {Object.keys(animalDescriptions).map((name) => (
	        <MenuItem onClick={clickHandler(name)} fs='xs' align='space-between center'>
	          <Block textTransform='capitalize'>{name}</Block>
	          <Tooltip message={animalDescriptions[name].description} placement='right' tooltipProps={{whiteSpace: 'normal', w: 200}}>
	          	<Icon name='info_outline' fs='xs' color='primary' />
          	</Tooltip>
	        </MenuItem>
	      ))}
	    </Dropdown>
	  )
  }
})