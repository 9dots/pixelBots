/**
 * Imports
 */

import {
  up as iconUp,
  down as iconDown,
  left as iconLeft,
  right as iconRight,
  turnRight,
  turnLeft
} from 'utils/icons'
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import animalApis, {gameImages} from 'animalApis'
import {component, element} from 'vdux'
import {Icon, Block} from 'vdux-ui'

/**
 * <GameController Selector/>
 */

export default component({
  render ({props}) {
  	const {rotation, turn, up, down, left, right, move, btnProps, w, ...rest} = props
    return (
      <Block {...rest}>
        <Block>
          <Button
            w={w / 3}
            onClick={turn(rotation - 90)}
            {...btnProps}
            borderRadius='3px 0 0 3px'
            mr={-1}>
              <Icon name={turnLeft} />
          </Button>
          <Button
            w={w / 3}
            onClick={up}
            {...btnProps}
            borderRadius='3px 0 0 3px'
            mr={-1}>
              <Icon name={iconUp} />
          </Button>
          <Button
            onClick={turn(rotation + 90)}
            w={w / 3}
            {...btnProps}
            borderRadius='0 3px 3px 0'
            borderLeft='1px solid rgba(black, .1)'>
              <Icon name={turnRight} />
          </Button>
        </Block>
        <Block>
          <Button
            w={w / 3}
            onClick={left}
            {...btnProps}
            borderRadius='3px 0 0 3px'
            mr={-1}>
              <Icon name={iconLeft} />
          </Button>
          <Button
            w={w / 3}
            onClick={down}
            {...btnProps}
            borderRadius='3px 0 0 3px'
            mr={-1}>
              <Icon name={iconDown} />
          </Button>
          <Button
            w={w / 3}
            onClick={right}
            {...btnProps}
            borderRadius='0 3px 3px 0'
            borderLeft='1px solid rgba(black, .1)'>
              <Icon name={iconRight} />
          </Button>
        </Block>
		  </Block>
    )
  }
})
