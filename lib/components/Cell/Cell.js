/**
 * Imports
 */

import {CSSContainer, wrap} from 'vdux-containers'
import {component, element} from 'vdux'
import {Block, Tooltip} from 'vdux-ui'

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
      animationSpeed = 0.15,
      onCellMouseOver,
      onCellMouseDown,
      enableColorTips,
      coordinates,
      hideBorder,
      showColor,
      lastColumn,
      lastRow,
      size,
      x,
      y
	  } = props

	  return (
      <Block
        onMouseOver={onCellMouseOver([x, y])}
        onMouseDown={onCellMouseDown([x, y])}
        borderWidth={hideBorder ? 0 : 1}
        borderRightWidth={lastColumn ? 1 : 0}
        borderBottomWidth={lastRow ? 1 : 0}
        borderColor='#CACACA'
        bgColor={color}
        zIndex={998}
        h={size}
        w={size}
        border>
        <Tooltip relative tooltipProps={{zIndex: 999999}} show={enableColorTips && showColor}>{color}</Tooltip>
      </Block>
    )
  }
}))
