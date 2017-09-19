/**
 * Imports
 */

import nameToIcon from 'utils/nameToIcon'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import RightWrap from 'utils/icons/rightwrap'
import LeftWrap from 'utils/icons/leftwrap'
import Steps from 'utils/icons/steps'
import Paint from 'utils/icons/tetris'
import {Icon} from 'vdux-ui'

/**
 * <Block Icon/>
 */

export default component({
  render ({props}) {
    const {type} = props

    if (type.search('paint') > -1) {
      return <Paint name={type} {...props} mt={type === 'paint' ? -10 : 0} />
    }
    
    switch (type) {
      case 'forward':
        return <Steps {...props} />
      case 'repeat':
        return <LoopIcon {...props} />
      case 'rightWrap':
        return <RightWrap {...props} />
      case 'leftWrap':
        return <LeftWrap {...props} />
      case 'ifColor':
        return <Icon bold fs='26px' lh='36px' name='IF' color='white' fontFamily='sans-serif' {...props} />
      default:
        return <Icon bold fs='30px' name={nameToIcon(type)} {...props} />
    }
  }
})
