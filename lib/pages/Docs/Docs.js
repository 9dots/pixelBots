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
          <Block lh='1.6em'>
            Using the advanced editor allows you to create more complex challenges with programatically generated and randomized starting grids.  This means puzzles can change between each run and the solver's code must be capable of solving any grid generated.
          </Block>
          <Block my='l' borderBottom='1px solid divider'/>
          <Header>3 Steps</Header>
          <Block tag='ol' lh='1.6em' pl={tabSize}>
            <Block tag='li' mb>
              Describe the challenge goal in the description. Advanced challenges have no target grid, so you will need to let the solver know how they need to transform the grid to solve the puzzle. For example, an advanced challenge description might be: "Repaint all the blue squares red."
            </Block>
            <Block tag='li' mb>
              Write a program that will paint a starting grid. Starting grids can include randomization, so the solver's solution must be able to solve any grid your code generates. Hit the "Generate Start Grid" to test your code.
            </Block>
            <Block tag='li' mb>
              Complete the challenge yourself following the rules you defined in the challenge description.  Your solution will be used as the key future solutions will be checked against. 
            </Block>
          </Block>
          <Block my='l' borderBottom='1px solid divider'/>
          <Header>API</Header>
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
            { palette.map(({name, value}) => <Block align='start center'>
                <Block w={160}>{name}</Block> <Block sq={20} bgColor={value} />
              </Block>) }
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