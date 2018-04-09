/**
 * Imports
 */

import { Button } from 'vdux-containers'
import { component, element } from 'vdux'
import { Icon } from 'vdux-ui'

/**
 * <Reset Board Button/>
 */

export default component({
  render ({ props }) {
    const { active, fs, canUndo, ...rest } = props
    return (
      <Button log={console.log(canUndo)} highlight={active} disabled={canUndo} {...rest}>
        <Icon fs={fs} bolder name='undo' />
      </Button>
    )
  }
})
