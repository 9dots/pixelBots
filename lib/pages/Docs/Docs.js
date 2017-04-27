/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import {component, element} from 'vdux'
import api from 'animalApis/teacherBot'
import mapValues from '@f/map-values'
import palette from 'utils/palette'
import {Block} from 'vdux-ui'

const tabSize = 40

/**
 * <Gallery/>
 */

export default component({
  render ({props}) {

    return (
  		<Block>
  			<PixelGradient h={150} fs='l'>
  				Creating Advanced Challenges
  			</PixelGradient>
        <Block w={800} m='20px auto 100px' bgColor='white' border='1px solid divider' py='l' px='xl'>
          <Header>How it works</Header>
          <Block lh='1.5em'>
            Using the advanced editor allows you to create more complex challenges with programatically generated starting grids.  This means the puzzles can change between each run and the solver must write a program that can solve any starting grid generated.
          </Block>
          <Block my='l' borderBottom='1px solid divider'/>
          <Header>Functions</Header>
          <Block lh='1.5em'>
            The things below do things
          </Block>
          {
  					mapValues(toItems, api)
  				}
          <Block my='l' borderBottom='1px solid divider'/>
          <Header>Colors</Header>
          <Block mb>
            The list below shows all the acceptable values that can be passed to the paint function.
          </Block>
          <Code ml={tabSize}>
            { palette.map(({name}) => <Block>{name}</Block>) }
          </Code>
          <Block my='l' borderBottom='1px solid divider'/>
          <Header>Example</Header>
          <Block mb>The code below does a thing.</Block>
          <Code ml={tabSize}>
            Here is the code below that does the thing eampls.
          </Code>
        </Block>
			</Block>
    )
  }
})

const Header = component({
  render({props, children}) {
    return (
      <Block fs='s' bolder my textTransform='uppercase' {...props}>
        {children}
      </Block>
    )
  } 
})

const Code = component({
  render({props, children}) {
    return (
      <Block fs='s' fontFamily='monospace' whiteSpace='pre' tabSize='20px' bgColor='rgba(blue, .1)' rounded p lh='1.6em' {...props}>
        {children}
      </Block>
    )
  } 
})

/**
 * Helpers
 */

function toItems (val, key) {
  const {usage, description} = val
  return (
    <Block hide={key === 'repeat_end'} py='m'>
      <Block fs='s' my textTransform='uppercase'>
        {camelSplit(key)} :
      </Block>
      <Block ml={tabSize}>
        <Block mb italic>
          {description}
        </Block>
        <Code>
          {usage}
        </Code>
      </Block>
    </Block>
  )
}

function camelSplit (text) {
  return text.replace(/([A-Z])/g, ' $1')
}