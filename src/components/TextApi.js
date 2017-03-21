/** @jsx element */

import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import CodeTool from './CodeTool'
import reduce from '@f/reduce'
import animalApis from '../animalApis/index'

function render ({props}) {
  const {type, ...restProps} = props
  const api = type ? animalApis[type].docs : {}
  return (
    <Block color='white' tall px='10px' {...restProps}>
      <Block>
        <Text align='center' fw='800' fs='l'>API</Text>
      </Block>
      <hr/>
      {reduce(getApiDocs, [], api)}
    </Block>
  )
}

function getApiDocs (arr, tool) {
  return [
    ...arr,
    <Block my='20px'>
      <CodeTool tool={tool}/>
    </Block>
  ]
}

export default {
  render
}
