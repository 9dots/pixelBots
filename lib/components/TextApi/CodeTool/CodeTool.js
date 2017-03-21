/**
 * Imports
 */

import {CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Text, Tooltip} from 'vdux-ui'

/**
 * <Code Tool/>
 */

export default wrap(CSSContainer, {
  lingerProps: {
    show: true
  }
})(component({
  render ({props}) {
  	const {tool, show} = props
	  return (
	    <Text cursor='zoom-in' fontFamily='code' fw='300' fs='s' pr='10px'>
	      {tool.usage}
	      <Tooltip
	        placement='right'
	        whiteSpace='wrap'
	        bgColor='white'
	        color='black'
	        show={show}
	        w='200px'
	        fs='s'>
	        {tool.description}
	      </Tooltip>
	    </Text>
	  )
  }
}))
