/**
 * Imports
 */

import nameToIcon from 'utils/nameToIcon'
import { component, element } from 'vdux'
import LoopIcon from 'utils/icons/loop'
import Steps from 'utils/icons/steps'
import Paint from 'utils/icons/tetris'
import { Icon, Block } from 'vdux-ui'

/**
 * <Block Icon/>
 */

export default component({
  render ({ props }) {
    const { name } = props
    const icon = nameToIcon(name)

    if (name.search('paint') > -1 && name !== 'paint') {
      return <Paint name={name} {...props} mt={name === 'paint' ? -10 : 0} />
    }

    switch (name) {
      case 'forward':
        return <Steps {...props} />
      case 'repeat':
        return <LoopIcon {...props} />
      case 'turnLeft':
        return (
          <Block align='center center' relative>
            <Block absolute fw={900} fs={11}>
              L
            </Block>
            <Icon lighter fs='37px' {...props} name={icon} />
          </Block>
        )
      case 'turnRight':
        return (
          <Block align='center center' relative>
            <Block absolute fw={900} fs={11}>
              R
            </Block>
            <Icon lighter fs='37px' {...props} name={icon} />
          </Block>
        )
      case 'ifColor':
        return (
          <Icon
            {...props}
            bold
            fs='26px'
            lh='36px'
            name='IF'
            color='white'
            fontFamily='sans-serif' />
        )
      case 'block_end':
        return <Block />
      default:
        return icon ? (
          <Icon bold fs='30px' {...props} name={icon} />
        ) : (
          <Block fontFamily='monospace'>{name}</Block>
        )
    }
  }
})
