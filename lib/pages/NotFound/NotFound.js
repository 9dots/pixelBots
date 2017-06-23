/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Image} from 'vdux-ui'

/**
 * <Not Found/>
 */

export default component({
  render ({props}) {
    return (
    	<Block column align='center center' p='xl' fs='l' mt='l' fontFamily='"Press Start 2P"'>
      	<Image src='/animalImages/chaoslarge.png' mb='l' />
      	PAGE NOT FOUND
    	</Block>
    )
  }
})
