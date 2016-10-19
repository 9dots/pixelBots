/** @jsx element */

import element from 'vdux/element'
import reduce from '@f/reduce'
import {Block, Box, Text} from 'vdux-containers'
import animalApis from '../animalApis'
import html from 'hypervdux'
import marked from 'marked'

function render ({props}) {
  const {animal} = props
  const docs = animalApis[animal.type].docs
  return (
    <Box p='20px' flex tall overflowY='auto' color='#C5C8C6' bgColor='#1D1F21'>
      <Text display='block' fs='xl'>{animal.type} API</Text>
      {reduce((arr, elem, key) => [...arr, createDoc(elem, key)], [], docs)}
    </Box>
  )
}

function createDoc (elem, key) {
  const {usage, description, args = []} = elem
  return (
    <Block my='10px'>
      <Text display='block' mb='5px' fontWeight='800' fs='l'>
        {usage}
      </Text>
      <Text fontFamily='ornate'>{html(marked(description))}</Text>
      {args.map(({name, type, description}) => (
        <ul>
          <li>
            <Text bgColor='#35373a' fontFamily='code'>{name}</Text> - {description}
          </li>
          <Text fontFamily='ornate'>{type}</Text>
        </ul>
      ))}
    </Block>
  )
}

export default {
  render
}
