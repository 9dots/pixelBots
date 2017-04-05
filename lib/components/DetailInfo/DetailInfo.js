/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import {Icon, Text} from 'vdux-ui'

/**
 * <Detail Info/>
 */

export default component({
  render ({props}) {
    const {icon, label, onClick, ...rest} = props
    return (
      <Block
        mx='1em'
        ml='0'
        fs='xs'
        onClick={onClick && onClick}
        transition='color .1s ease-in-out'
        hoverProps={onClick && {color: 'link', cursor: 'pointer'}}
        fontWeight='300'
        align='center center'
        {...rest}>
        <Icon textDecoration='none' fs='xs' name={icon} />
        <Text ml='4px'>{label}</Text>
      </Block>
    )
  }
})
