/**
 * Imports
 */

import nameToColor from 'utils/nameToColor'
import nameToIcon from 'utils/nameToIcon'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import {Icon} from 'vdux-ui'

/**
 * <Block Icon/>
 */

export default component({
  render ({props}) {
    const {type} = props

    switch (type) {
      case 'repeat':
        return <LoopIcon {...props} />
      case 'ifColor':
        return <Icon bold fs='26px' lh='36px' name='IF' color='white' fontFamily='sans-serif' {...props} />
      default:
        return <Icon bold fs='30px' name={nameToIcon(type)} color={nameToColor(type)} {...props} />
    }
  }
})
