/**
 * Imports
 */

import {Dropdown, Grid} from 'vdux-containers'
import ColorSwatch from './ColorSwatch'
import {component, element} from 'vdux'

/**
 * <Color Picker/>
 */

export default component({
  render ({props}) {
	  const {btn, clickHandler, palette, swatchSize = '24px', ...restProps} = props
	  let close

	  return (
	    <Dropdown zIndex='999' ref={(api) => close = api.close} btn={btn} {...restProps}>
	      <Grid itemsPerRow='4' rowAlign='center center' columnAlign='start center'>
	        {palette.map(({value, name}) => <ColorSwatch
	          size={swatchSize}
	          bgColor={value}
	          close={close}
	          name={name}
	          clickHandler={clickHandler}/>)}
	      </Grid>
	    </Dropdown>
	  )
  }
})
