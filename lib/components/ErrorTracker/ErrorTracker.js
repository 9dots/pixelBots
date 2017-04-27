/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'

/**
 * <Error Tracker/>
 */

export default component({
  render ({props}) {
  	const {invalid, errorMessage} = props 

    return (
    	<Block column align='start center'>
	    	<Block pt pb='s' align='start center' hide={!invalid}>
	    		<Icon name='error' color='red' mr='s'/> 
	    		<Block fontFamily='"Press Start 2P"'>x{invalid}</Block>
	      </Block>
	      <Block 
	      	textTransform='uppercase'
	      	hide={!errorMessage} 
	      	fs='s'>
	      	Wrong {errorMessage}
	      </Block>
      </Block>
    )
  }
})
