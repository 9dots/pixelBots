/**
 * Imports
 */

import { Block, Icon, Text } from 'vdux-ui'
import { component, element } from 'vdux'
import Button from 'components/Button'

/**
 * <Dropdown Button/>
 */

export default component({
  render ({ props }, children) {
    const { text, ...restProps } = props
    return (
      <Button
        w='150px'
        fs='xs'
        bgColor='white'
        color='primary'
        hoverProps={{ highlight: 0.02 }}
        borderColor='#CCC'
        focusProps={{ highlight: 0.04 }}
        {...restProps}>
        <Block wide align='space-between center'>
          <Text textAlign='left' flex textTransform='capitalize'>
            {text}
          </Text>
          <Icon relative right='0' mt='3px' fs='s' name='keyboard_arrow_down' />
        </Block>
      </Button>
    )
  }
})
