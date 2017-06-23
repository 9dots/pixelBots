/**
 * Imports
 */

import {Block, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Empty State/>
 */

export default component({
  render ({props}) {
  	const {icon = 'info', color = 'blue', title = 'Nothing Here', description = 'Check back for later for more!', ...rest} = props
    return (
    	<Block p='l' pt='xl' maxWidth='450' m='0 auto' color='primary' {...rest}>
    		<Block>
	    		<Block align='center center' borderBottom='2px solid grey' pb px='l'>
	    			<Icon name={icon} fs='65px' color={color} mr />
	    			<Block fs='l' color={color}>
	    				{title}
	    			</Block>
	    		</Block>
	    		<Block p lh='26px' textAlign='center'>
    				{description}
  				</Block>
    		</Block>
    	</Block>
    )
  }
})
