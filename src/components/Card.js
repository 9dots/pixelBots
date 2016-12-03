import {Block, Card, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props, children}) {
	const {selected = false, cardImage = '', cardTitle = '', cardHeader = '', cardFooter = '', ...restProps} = props
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
        cardHeader && <Block>
          {cardHeader}
        </Block>
      }
      <Block p='20px'>
        {
          cardImage && <Block border='1px solid #ccc'>
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
        cardFooter && <Block absolute bottom='0'>
          {cardFooter}
        </Block>
      }
		</Card>
	)
}

export default {
	render
}