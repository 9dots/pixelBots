/**
 * Imports
 */

import {component, element} from 'vdux'
import Button from 'components/Button'

/**
 * <Game Button/>
 */

export default component({
  render ({props, children}) {
  	const {bg, bgColor, ...rest} = props
  	const color = bgColor || bg || 'blue' 
  	const sHeight = 4

    return (
    	<Button
	      boxShadow={`0 ${sHeight}px rgba(black, .3), 0 ${sHeight}px ${color}`}
	      mb={sHeight}
	      color='white'
	    	bgColor={color}
	      fs='l'
	      p='10px 0px'
	      // activeProps={}
	      {...rest}>
	      {children}
    	</Button>
    )
  }
})
