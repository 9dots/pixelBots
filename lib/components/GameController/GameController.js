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
  	const {rotation, turn, up, down, left, right, move, btnProps, w, h = 48,  ...rest} = props
    return (
      <Block {...rest}>
        <Block align='center center'>
          <Button
            onClick={up}
            {...btnProps}
            borderRadius='3px 3px 0px 0px'
            mb={0}
            boxShadow='0 0'
            w={w / 3}
            h={h / 2}
            // mr={-1}
            >
              <Icon name={iconUp} />
          </Button>
        </Block>
        <Block align='stretch center'>
          <Button
            onClick={left}
            {...btnProps}
            w={w / 3}
            h={h / 2}
            borderRadius='3px 0 0 3px'
            // mr={-1}
            >
              <Icon name={iconLeft} />
          </Button>
          <Block h={(h / 2) + 4} bgColor='#333' w={w/3}/>
          <Button
            onClick={right}
            {...btnProps}
            w={w / 3}
            h={h / 2}
            borderRadius='0 3px 3px 0'
            // borderLeft='1px solid rgba(black, .1)'
            >
              <Icon name={iconRight} />
          </Button>
        </Block>
        <Block align='center center'>
          <Button
              onClick={down}
              {...btnProps}
              w={w / 3}
              h={h / 2}
              borderRadius='0 0 3px 3px'
              // borderLeft='1px solid rgba(black, .1)'
              // borderTop='1px solid rgba(black, .1)'
              // mr={-1}
              >
                <Icon name={iconDown} />
            </Button>
        </Block>
		  </Block>
    )
  }
})
