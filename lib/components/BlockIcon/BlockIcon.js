
/**
 * Imports
 */

import nameToIcon from 'utils/nameToIcon'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import Steps from 'utils/icons/steps'
import Paint from 'utils/icons/tetris'
import {Icon, Block} from 'vdux-ui'

/**
 * <Block Icon/>
 */

export default component({
  render ({props}) {
    const {name} = props
    const icon = nameToIcon(name)

    if (name.search('paint') > -1) {
      return <Paint name={name} {...props} mt={name === 'paint' ? -10 : 0} />
    }

    switch (name) {
      case 'forward':
        return <Steps {...props} />
      case 'repeat':
        return <LoopIcon {...props} />
      case 'ifColor':
        return <Icon bold fs='26px' lh='36px' name='IF' color='white' fontFamily='sans-serif' {...props} />
      default:
        return icon
          ? <Icon bold fs='30px' {...props} name={icon} />
          : <Block>{name}</Block>
    }
  }
})
