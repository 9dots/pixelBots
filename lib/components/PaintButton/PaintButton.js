/**
 * Imports
 */

import { Button } from 'vdux-containers'
import { component, element } from 'vdux'
import { Icon } from 'vdux-ui'

/**
 * <Paint Button/>
 */

export default component({
  render ({ props }) {
    const { active, ...rest } = props
    return (
      <Button highlight={active} px='16' borderRadius='3px' {...rest}>
        <Icon fs='inherit' name='brush' />
      </Button>
    )
  }
})
