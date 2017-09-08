/**
 * Imports
 */

import {Button, Dropdown, MenuItem} from 'vdux-containers'
import animalApis, {gameImages} from 'animalApis'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <Turn Selector/>
 */

export default component({
  render ({props, actions}) {
  	const {turn} = actions
  	const {rotation, clickHandler, btnProps, w, ...rest} = props

    return (
      <Block {...rest}>
        <Button
          w={w / 2}
          onClick={clickHandler(rotation - 90)}
          {...btnProps}
          borderRadius='3px 0 0 3px' 
          mr={-1}
          w={w / 2}>
            <Icon name='rotate_left' />
        </Button>
        <Button  
          onClick={clickHandler(rotation + 90)}
          {...btnProps}
          borderRadius='0 3px 3px 0'
          borderLeft='1px solid rgba(black, .1)'
          w={w / 2}>
            <Icon name='rotate_right' />
        </Button>
		  </Block>
    )
  }
})
