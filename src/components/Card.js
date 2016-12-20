import {Block, Card, Text} from 'vdux-ui'
import {CSSContainer, wrap} from 'vdux-containers'
import element from 'vdux/element'

function render ({props, children}) {
	const {selected = false, cardImage = '', cardTitle = '', cardHeader = '', cardFooter = '', hovering, hoverOptions, ...restProps} = props
	return (
		<Card
			transform={selected ? 'scale3d(0.75, 0.81, 1)' : ''}
			transition='transform .1s ease-in-out'
			h='288px'
			w='192px'
			relative
			color='#333'
			{...restProps}>
      {
        (hovering && hoverOptions) && (
          <Block absolute wide tall zIndex='5' bgColor='rgba(0,0,0,0.7)'>
            {hoverOptions}
          </Block>
        )
      }
      {
        cardHeader && <Block>
          {cardHeader}
        </Block>
      }
      <Block p='20px'>
        {
          cardImage && <Block border='1px solid #e5e5e5'>
            {cardImage}
          </Block>
        }
        <Block mt={cardImage ? '15px' : ''}>
          <Block mb='10px'>
            <Block
              fs='m'
              fontWeight='300'
              maxWidth='130px'
              textOverflow='ellipsis'
              whiteSpace='nowrap'
              overflow='hidden'>
              {cardTitle}
            </Block>
          </Block>
          <Block fs='s'>
            {children}
          </Block>
        </Block>
      </Block>
      {
        cardFooter && <Block absolute bottom='0' left='0' right='0'>
          {cardFooter}
        </Block>
      }
		</Card>
	)
}

export default wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})({
  render
})