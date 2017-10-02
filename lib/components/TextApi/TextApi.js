/**
 * Imports
 */

import { component, element } from 'vdux'
import mapValues from '@f/map-values'
import { Block, Text } from 'vdux-ui'
import CodeTool from './CodeTool'
import omit from '@f/omit'

/**
 * <TextApi/>
 */

export default component({
  render ({ props }) {
    const { docs, ...restProps } = props

    return (
      <Block
        color='white'
        tall
        p='13px'
        tabSize='20px'
        {...omit('title', restProps)}
        title=''
        overflowY='auto'>
        <Block>
          <Text align='center' fw='800' fs='l'>
            API
          </Text>
        </Block>
        <hr />
        {mapValues(
          (tool, name) => (
            <Block my='18px' hide={tool.hidden}>
              <CodeTool tool={tool} name={name} />
            </Block>
          ),
          docs
        )}
      </Block>
    )
  }
})
