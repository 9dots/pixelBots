/**
 * Imports
 */

import {red, yellow, green, blue} from 'utils/colors'
import {component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'
import times from '@f/times'

/**
 * Constants
 */

const colors = [red, yellow, green, blue]

/**
 * Loading
 */

export default component({
  render ({props}) {
    return (
      <Text absolute m='auto' w={200} h={100} textAlign='center' top={0} right={0} bottom={0} left={0}>
        <Block mt='m'>
          <Text lh='30px' fw='lighter'>Loading…</Text>
        </Block>
        <Block
          sq='80px'
          align='center center'
          animation='spin ease-in-out'
          animationDuration='6s'
          animationIterationCount='infinite'
          m='auto'>
          {
            times(4, (i) => {
              return (
                <Block
                  my={0}
                  absolute
                  inlineBlock
                  bgColor={colors[i]}
                  circle='15'
                  transform={getTransform(i)}
                  animation='wave 2s infinite ease-in-out'
                  animationDelay={0.1 * (i + 1) + 's'} />)
              })
          }
        </Block>
      </Text>
    )
  }
})

function getTransform (i) {
  let size = 20
  let direction
  if (i % 2 === 0) {
    direction = 'Y'
  } else {
    direction = 'X'
  }
  if (i > 1) size *= -1
  return `translate${direction}(${size}px)`
}
