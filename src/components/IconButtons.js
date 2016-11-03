/** @jsx element */

import {Button, Icon, Text} from 'vdux-containers'
import {nameToIcon, nameToColor} from '../utils'
import animalApis from '../animalApis'
import element from 'vdux/element'
import {addCode} from '../actions'
import reduce from '@f/reduce'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {active, type} = props
  const docs = animalApis[type].docs

  return (
    <Block column align='start center' wide tall>
      <Block>
        <Text align='center' fw='800' fs='l'>{type} buttons</Text>
      </Block>
      <hr style={{width: '100%'}}/>
      {reduce((arr, val, key) => [...arr, createButton(key, val)], [], docs)}
    </Block>
  )

  function createButton (name, doc) {
    const args = doc.args
      ? doc.args.map((a) => a.type === 'number' ? 1 : '').join(',')
      : ''
    return (
      <Button
        hoverProps={{highlight: true, boxShadow: '0 2px 5px 0px rgba(0,0,0,0.6)'}}
        wide
        h='40px'
        m='5px'
        fs='14px'
        bgColor='buttons'
        align='center center'
        boxShadow='0 2px 5px 0px rgba(0,0,0,.8)'
        transition='all .3s ease-in-out'
        onClick={() => [addCode(active, `${name}(${args})`)]}>
        <Icon bold fs='30px' name={nameToIcon(name)} color={nameToColor(name)}/>
      </Button>
    )
  }
}

export default {
  render
}
