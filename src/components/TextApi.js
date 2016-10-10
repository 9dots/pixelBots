/** @jsx element */

import element from 'vdux/element'
import {Block, Text} from 'vdux-ui'
import CodeTool from './CodeTool'
import reduce from '@f/reduce'
import animalApis from '../animalApis/index'

function render ({props}) {
  const {type, active} = props
  const api = animalApis[type](active)
  return (
    <Block color='white' wide tall px='10px'>
      <Block>
        <Text align='center' fw='800' fs='xl'>{type} API</Text>
      </Block>
      <hr/>
      {reduce(getApiDocs, [], api.docs)}
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
