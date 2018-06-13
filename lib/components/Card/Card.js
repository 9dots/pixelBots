/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block, Box, Card } from 'vdux-ui'
import { CSSContainer, wrap } from 'vdux-containers'

/**
 * <Card/>
 */

export default wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(
  component({
    render ({ props, children }) {
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
          {hovering &&
            hoverOptions && (
              <Block absolute bgColor='rgba(0,0,0,0.7)' tall wide zIndex='5'>
                {hoverOptions}
              </Block>
            )}
          {headerColor && (
            <Block
              relative
              wide
              h='10px'
              top='0'
              bgColor={headerColor}
              borderRadius={`${borderRadius}px ${borderRadius}px 0 0`} />
          )}
          {cardHeader && <Block>{cardHeader}</Block>}
          <Box align='start start' column flex p='20px'>
            {cardImage && <Block border='1px solid #e5e5e5'>{cardImage}</Block>}
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
              <Block fs='s'>{children}</Block>
            </Box>
            {cardFooter && <Block>{cardFooter}</Block>}
          </Box>
        </Card>
      )
    }
  })
)
