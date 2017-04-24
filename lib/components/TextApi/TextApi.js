/**
 * Imports
 */

import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import {Block, Text} from 'vdux-ui'
import CodeTool from './CodeTool'

/**
 * <TextApi/>
 */

export default component({
  render ({props}) {
	  const {docs, ...restProps} = props

	  return (
	    <Block color='white' tall p='13px' tabSize='20px' {...restProps}>
	      <Block>
	        <Text align='center' fw='800' fs='l'>API</Text>
	      </Block>
	      <hr/>
	      {
          mapValues(tool => (
            <Block my='18px'>
              <CodeTool tool={tool} />
            </Block>
          ), docs)
        }
	    </Block>
	  )
  }
})
