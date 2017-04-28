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
			  		circle='41' 
			  		fw='normal'
			  		fs='m'>
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
	          w='38px'
	          h='2px'
	          bgColor={isComplete ? done : inactive}/>
	      }
  		</Block>
  	)

	  return (
	    <Block
	      cursor='pointer'
	      align='center center'
	      onClick={onClick(label)}
	      {...restProps}>
	      <Block
	        pill
	        px='1em'
	        py='.5em'
	        bgColor={isComplete ? 'blue' : 'transparent'}
	        color={getColor()}
	        borderWidth='2px'
	        borderStyle='solid'
	        borderColor={isComplete || active ? 'blue' : '#666'}>
	        {label}
	      </Block>
	      {
	        !lastItem && <Block
	          w='22px'
	          h='2px'
	          bgColor={isComplete ? 'blue' : '#666'}/>
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

