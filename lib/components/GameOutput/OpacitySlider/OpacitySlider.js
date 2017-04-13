/**
 * Imports
 */

import {Block, Icon, Slider} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Opacity Slider/>
 */

export default component({
  render ({props}) {
	  const {opacity, onChange, ...rest} = props

	  return (
    	<Block align='start center' flex {...rest}>
    		<Icon name='panorama_fisheye' fs={18} />
	      <Slider
	        barProps={{border: '1px solid #BBB', h: '6'}}
	        handleProps={{bgColor: 'white'}}
	        name='opacity-slider' 
	        startValue={opacity}
	        onChange={onChange}
	        step='0.1'
	        mx={15}
	        max={1} />
	       <Icon name='lens' fs={18} />
      </Block>
	  )
  }
})
