/**
 * Imports
 */

import nameToIcon from 'utils/nameToIcon'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
// import PickUpMove from 'utils/icons/pickUpMove'
import Steps from 'utils/icons/steps'
import Paint from 'utils/icons/tetris'
import {Icon, Block} from 'vdux-ui'

/**
 * <Block Icon/>
 */

export default component({
  render ({props}) {
    const {type} = props

    if(type.indexOf('pickUpMove') > -1) {
      return <PickUpMove {...props} />
    }

    if(type.indexOf('placeMove') > -1) {
      return <PlaceMove {...props} />
    }


    if (type.search('paint') > -1) {
      return <Paint name={type} {...props} mt={type === 'paint' ? -10 : 0} />
    }
    switch (type) {
      case 'forward':
        return <Steps {...props} />
      case 'repeat':
        return <LoopIcon {...props} />
      // case 'pickUpMoveRight':
      //   return <PickUpMove {...props} />
      // case 'pickUpMoveLeft':
      //   return <PickUpMove transform='rotate(180deg)' {...props} />
      // case 'pickUpMoveUp':
      //   return <PickUpMove transform='rotate(-90deg)' {...props} />
      // case 'pickUpMoveDown':
      //   return <PickUpMove transform='rotate(90deg)' {...props} />
      case 'ifColor':
        return <Icon bold fs='26px' lh='36px' name='IF' color='white' fontFamily='sans-serif' {...props} />
      default:
        return <Icon bold fs='30px' name={nameToIcon(type)} {...props} />
    }
  }
})

const PickUpMove = component({
  render ({props}) {
    const {type, ...rest} = props
    const icon = type.split('pickUpMove')[1].toLowerCase()

    return (
      <Block>
        <Icon bold fs='23px' name={nameToIcon('pickUp')} mr='s' {...rest} />
        <Icon bold fs='23px' name={nameToIcon(icon)} {...rest} />
      </Block>
    )
  }
})

const PlaceMove = component({
  render ({props}) {
    const {type, ...rest} = props
    const icon = type.split('placeMove')[1].toLowerCase()

    return (
      <Block>
        <Icon bold fs='23px' name={nameToIcon('place')} mr='s' {...rest} />
        <Icon bold fs='23px' name={nameToIcon(icon)} {...rest} />
      </Block>
    )
  }
})
