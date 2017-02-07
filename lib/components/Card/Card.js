/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block, Box, Card} from 'vdux-ui'
import {CSSContainer, wrap} from 'vdux-containers'

/**
 * <Card/>
 */

export default wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(component({
  render ({props, children}) {
    const {
      selected = false,
      cardImage = '',
      cardTitle = '',
      cardHeader = '',
      cardFooter = '',
      hovering,
      headerColor,
      hoverOptions,
      hoverProps,
      borderRadius,
      ...restProps
    } = props
    return (
      <Card
        transform={selected ? 'scale3d(0.75, 0.81, 1)' : ''}
        transition='all .1s ease-in-out'
        h='288px'
        w='192px'
        relative
        borderRadius={borderRadius}
        hoverProps={hoverProps}
        display='flex'
        column
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
          headerColor && (
            <Block borderRadius={`${borderRadius} ${borderRadius} 0 0`} relative wide h='10px' top='0' bgColor={headerColor} />
          )
        }
        {
          cardHeader && <Block>
            {cardHeader}
          </Block>
        }
        <Box flex p='20px' column align='start start'>
          {
            cardImage && <Block border='1px solid #e5e5e5'>
              {cardImage}
            </Block>
          }
          <Box flex mt={cardImage ? '15px' : ''}>
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
          </Box>
          {
            cardFooter && <Block>
              {cardFooter}
            </Block>
          }
        </Box>
      </Card>
    )
  }
})
)
