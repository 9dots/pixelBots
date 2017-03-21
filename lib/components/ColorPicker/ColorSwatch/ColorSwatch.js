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
		const {clickHandler, size, bgColor, showColor, name, close} = props
		return (
			<Block
	      onClick={[close, clickHandler(name)]}
	      hoverProps={{border: '1px solid black'}}
	      h={size}
	      w={size}
	      m='5px'
	      bgColor={bgColor}>
	      <Tooltip relative show={showColor}>{name}</Tooltip>
	     </Block>
		)
  }
}))
