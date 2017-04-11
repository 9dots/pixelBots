/**
 * Imports
 */

import {Block, CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Tooltip} from 'vdux-ui'

/**
 * <Color Swatch/>
 */

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})(component({
  render ({props}) {
		const {clickHandler, size, bgColor, showColor, name, close, ...rest} = props
		return (
			<Block
	      onClick={[close, clickHandler(name)]}
	      hoverProps={{border: '1px solid #999'}}
	      h={size}
	      w={size}
	      m='5px'
	      bgColor={bgColor}
	      {...rest}>
	      <Tooltip relative show={showColor}>{name}</Tooltip>
	     </Block>
		)
  }
}))
