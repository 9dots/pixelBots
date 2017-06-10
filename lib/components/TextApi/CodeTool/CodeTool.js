/**
 * Imports
 */

import {CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Tooltip, Text} from 'vdux-ui'
import template from 'lodash/template'
import map from '@f/map'

/**
 * <Code Tool/>
 */

export default wrap(CSSContainer, {
  lingerProps: {
    show: true
  }
})(component({
  render ({props}) {
  	const {tool, show, name} = props
    const args = Array.isArray(tool.args)
      ? tool.args.map(arg => arg.name)
      : []
    const description = template(tool.description)
    const defaultArgs = tool.defaultArgs || []
    const params = args.length === 0 ? defaultArgs : args
    
	  return (
	    <Text fontFamily='code' fw='300' letterSpacing='0px' fs={14}>
	      <Text whiteSpace='pre-wrap'>
          {tool.usage || `${name}(${args.join(',')})`}
        </Text>
	      <Tooltip
	        placement='right'
	        whiteSpace='wrap'
	        bgColor='white'
	        color='black'
	        show={show}
	        w='200px'
	        tooltipProps={{ml: 20}}
	        fs='s'>
	        {description({args: params.map(wrapString)})}
	      </Tooltip>
	    </Text>
	  )
  }
}))

/**
 * Helper Functions
 */

function wrapString (string) {
	return typeof string === 'string' ? '`' + string + '`' : string
}
