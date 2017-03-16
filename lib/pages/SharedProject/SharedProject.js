/**
 * Imports
 */

import DisplayCard from 'components/DisplayCard'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Shared Projec/>
 */

export default component({
  render ({props}) {
	  const {gameRef, saveRef, link} = props
	  return (
	    <Block wide tall align='center center'>
	      <Block>
	        <DisplayCard w='500px' imageSize='500px' {...props} />
	      </Block>
	    </Block>
	  )
  }
})
