/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block } from 'vdux-ui'

/**
 * <BlockCursor/>
 */

export default component({
  render ({ props }) {
    const { ml, ...rest } = props

    return (
      <Block align='center center' {...rest} ml={35 + (ml || 0)}>
        <Block class='flashing-cursor' wide h='25%' bgColor='white' />
      </Block>
    )
  }
})
