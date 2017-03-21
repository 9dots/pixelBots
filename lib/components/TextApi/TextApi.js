/**
 * Imports
 */

import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import {Block, Text} from 'vdux-ui'
import animalApis from 'animalApis'
import CodeTool from './CodeTool'

/**
 * <Text Api/>
 */

const getApiDocs = (tool) => (
	<Block my='20px'>
    <CodeTool tool={tool}/>
  </Block>
)

export default component({
  render ({props}) {
	  const {type, ...restProps} = props
	  const api = type ? animalApis[type].docs : {}
	  return (
	    <Block color='white' tall py='10px' px='20px' {...restProps}>
	      <Block>
	        <Text align='center' fw='800' fs='l'>API</Text>
	      </Block>
	      <hr/>
	      {mapValues(getApiDocs, api)}
	    </Block>
	  )
  }
})
