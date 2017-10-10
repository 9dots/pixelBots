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
    const { ml, block = {}, prevBlock = {}, ...rest } = props
    const pad = prevBlock.parentType === 'userFn' || block.type === 'userFn'

    return (
      <Block
        align='center center'
        py={pad ? 15 : 0}
        boxSizing='content-box'
        {...rest}
        ml={35 + (ml || 0)}>
        <Block class='flashing-cursor' wide h='25%' bgColor='white' />
      </Block>
    )
  }
})
