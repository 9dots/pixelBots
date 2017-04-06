/**
 * Imports
 */

import {CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Tooltip} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <Cell/>
 */

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})(component({
  render ({props, actions}) {
	  const {
	    color = 'white',
	    animationSpeed = .15,
	    clickHandler,
	    coordinates,
	    hideBorder,
	    showColor,
	    mode,
	    dragging,
	    lastColumn,
	    lastRow,
	    size,
	    x,
	    y
	  } = props

	  return (
	    <Block
	      transition={mode !== 'edit' && `background-color ${animationSpeed}s ease-in-out`}
	      onMouseOver={actions.handleMouseOver()}
	      onMouseDown={clickHandler && clickHandler([x, y])}
	      borderWidth={hideBorder ? 0 : 1}
	      borderRightWidth={lastColumn ? 1 : 0}
	      borderBottomWidth={lastRow ? 1 : 0}
	      borderColor='#CACACA'
	      key={`cell-holder-${x}-${y}`}
	      bgColor={color}
	      h={size}
	      w={size}
	      border>
	      <Tooltip relative show={showColor}>{color}</Tooltip>
	    </Block>
	  )
  },
  controller: {
  	* handleMouseOver ({props}) {
	    if (props.dragging && props.clickHandler) {
	      yield props.clickHandler([props.x, props.y])
	    }
  	}
  }
}))

