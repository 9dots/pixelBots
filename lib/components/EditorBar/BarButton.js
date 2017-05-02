/**
 * Imports
 */

import {component, element} from 'vdux'
import {Tooltip} from 'vdux-containers'
import Button from 'components/Button'
import {Icon} from 'vdux-ui'

/**
 * <BarButton/>
 */

export default component({
  render ({props, children}) {
    const {icon, text, bgColor, disabled, ...rest} = props

    return (
      <Tooltip message={text}>
        <Button
          bgColor={icon ? 'transparent' : bgColor}
          mx='4px'
          p='4px'
          fs={icon ? 'm' : 'xs'}
          h={30}
          icon={icon}
          opacity={disabled ? .25 : 1}
          disabled={disabled}
          {...rest}
          color='white'>
          { children }
        </Button>
      </Tooltip>
    )
  }
})
