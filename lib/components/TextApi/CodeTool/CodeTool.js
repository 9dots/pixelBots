/**
 * Imports
 */

import {CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Tooltip, Text} from 'vdux-ui'

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
	    <Text fontFamily='code' fw='300' letterSpacing='0px' fs={14}>
	      <Text whiteSpace='pre-wrap'>{tool.usage}</Text>
	      <Tooltip
	        placement='right'
	        whiteSpace='wrap'
	        bgColor='white'
	        color='black'
	        show={show}
	        w='200px'
	        tooltipProps={{ml: 20}}
	        fs='s'>
	        {tool.description}
	      </Tooltip>
	    </Text>
	  )
  }
}))
