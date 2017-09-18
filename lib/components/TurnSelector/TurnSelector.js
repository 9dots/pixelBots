/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import animalApis, {gameImages} from 'animalApis'
import {component, element} from 'vdux'
import Step from 'utils/icons/steps'
import {Icon, Block} from 'vdux-ui'

/**
 * <Turn Selector/>
 */

export default component({
  render ({props, actions}) {
  	const {turn} = actions
  	const {rotation, clickHandler, btnProps, fwd, w, ...rest} = props

    return (
      <Block align='center center' {...rest}>
        <Button
          onClick={clickHandler(rotation - 90)}
          {...btnProps}
          borderRadius='3px 0 0 3px'
          mr={-1}
          w={w / 3}>
            <Icon name='rotate_left' />
        </Button>
        <Button
          hide={fwd === undefined}
          onClick={fwd}
          {...btnProps}
          borderLeft='1px solid rgba(black, .1)'
          borderRadius='0'
          mr={-1}
          w={w / 3}>
            <Step h={35} color={btnProps.color} />
        </Button>
        <Button
          onClick={clickHandler(rotation + 90)}
          {...btnProps}
          borderRadius='0 3px 3px 0'
          borderLeft='1px solid rgba(black, .1)'
          w={w / 3}>
            <Icon name='rotate_right' />
        </Button>
		  </Block>
    )
  }
})
