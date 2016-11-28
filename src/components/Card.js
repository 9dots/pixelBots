import {Block, Card, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props, children}) {
	const {selected = false, cardImage = '', cardTitle = '', ...restProps} = props
	return (
		<Card
			transform={selected ? 'scale3d(0.75, 0.81, 1)' : ''}
			transition='transform .1s ease-in-out'
			h='288px'
			w='192px'
			relative
			p='20px'
			color='#333'
			{...restProps}>
			{
				cardImage && <Block border='1px solid #ccc'>
					{cardImage}
      	</Block>
    	}
      <Block mt={cardImage ? '15px' : ''} column align='center center'>
        <Block mb='10px'>
        	<Text
        		fs='m'
        		fontWeight='300'
        		maxWidth='130px'
        		textOverflow='ellipsis'
        		whiteSpace='nowrap'
        		overflow='hidden'>
        		{cardTitle}
        	</Text>
        </Block>
        <Block fs='s'>
        	{children}
        </Block>
      </Block>
		</Card>
	)
}

export default {
	render
}