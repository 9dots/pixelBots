/**
 * Imports
 */

import {Block, MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import {Icon} from 'vdux-ui'

/**
 * <Flow Item/>
 */

export default component({
  render ({props}) {
	  const {active, onClick, label, lastItem, isComplete, i,...restProps} = props
	  const inactive = '#BBB'
	  const done = 'blue'
	  return (
	  	<Block pointer align='center center' onClick={onClick(label)}>
	  		<Block textAlign='center' relative>
			  	<Block 
			  		border={'2px solid' }
			  		borderColor={active ? 'primary' : isComplete ? done : inactive}
			  		color={active ? 'primary' : inactive}
			  		align='center center' 
			  		circle='38' 
			  		fw='normal'
			  		fs='18px'>
			  		{ isComplete ? <Icon name='done' color='blue'/> : i + 1}
		  		</Block>
		  		<Block 
		  			color={active ? 'primary' : isComplete ? done : inactive}
		  			textTransform='uppercase' 
		  			m='10px auto 0' 
		  			fs='xxs'
		  			absolute 
		  			top='100%'
		  			right='-10'
		  			left='-10'>
		  			{label}
		  		</Block>
	  		</Block>
	  		{
	        !lastItem && <Block
	          w='28px'
	          h='2px'
	          bgColor={isComplete ? done : inactive}/>
	      }
  		</Block>
  	)

	  function getColor () {
	    if (isComplete) return 'white'
	    if (active) return 'blue'
	    return 'inherit'
	  }
  }
})

