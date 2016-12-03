import {Block, CSSContainer, wrap} from 'vdux-containers'
import element from 'vdux/element'
import {Tooltip} from 'vdux-ui'

function render ({props}) {
	const {clickHandler, size, bgColor, showColor, name} = props
	return (
		<Block
      onClick={() => clickHandler(name)}
      hoverProps={{border: '1px solid black'}}
      h={size}
      w={size}
      m='5px'
      bgColor={bgColor}>
      <Tooltip relative show={showColor}>{name}</Tooltip>
     </Block>
	)
}

export default wrap(CSSContainer, {
  lingerProps: {
    showColor: true
  }
})({
  render
})