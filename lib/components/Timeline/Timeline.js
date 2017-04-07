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
  	const {frames, frameNumber, onClick, ...rest} = props
  	const numBlocks = 14
    return (
    	<Block 
    		boxShadow='inset 0 0 6px rgba(black, .1)' 
    		border='1px solid divider' 
    		borderRightWidth={0}
    		align='start stretch' 
    		bgColor='#EEE' 
    		h={50} 
    		{...rest}>
    		{
    			times(numBlocks, function (i) {
    				const curProps = i === frameNumber
    					? {
    							bgColor: 'blue',
    							borderColor: 'transparent',
    							transform: 'scale(1.2)',
    							boxShadow: '0 0 2px rgba(black, .3), inset 0 0 0 1px rgba(0,0,0, .1)',
    							color: 'white'
    						}
    					: {}
    				const isActive = i < frames.length

  					return(
	    				<Block 
	    					bgColor={isActive ? 'white' : 'transparent'}
	    					borderRight='1px solid divider' 
	    					onClick={isActive && onClick(i)}
	    					userSelect='none'
	    					cursor='default'
	    					maxWidth={25}
	    					minWidth={16} 
	    					flex
	    					align='center end'
	    					fs='10'
	    					pb='s'
	    					{...curProps}>
	    					{isActive ? i + 1 : ''}
	    					</Block>
							)
	    			}
  				)
    		}
    	</Block>
    )
  }
})
