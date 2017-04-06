/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import times from '@f/times'

/**
 * <Timeline/>
 */

export default component({
  render ({props}) {
  	const {frames = 16, ...rest} = props
    return (
    	<Block 
    		boxShadow='inset 0 0 6px rgba(black, .1)' 
    		border='1px solid divider' 
    		align='start stretch' 
    		bgColor='#EEE' 
    		h={50} 
    		{...rest}>
    		{
    			times(frames, function (i) {
    				const activeProps = i === 1 
    					? {
    							bgColor: 'blue',
    							border: '1px solid rgba(black, .1)',
    							transform: 'scale(1.2)',
    							boxShadow: '0 0 2px rgba(black, .3)'
    						}
    					: {}
  					return(
	    				<Block 
	    					bgColor={i > 2 ? 'transparent' : 'white'}
	    					borderRight='1px solid divider' 
	    					maxWidth={25}
	    					minWidth={16} 
	    					flex
	    					{...activeProps} />
							)
	    			}
  				)
    		}
    	</Block>
    )
  }
})
