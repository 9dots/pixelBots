/** @jsx element */

import {Button, Icon, Text} from 'vdux-containers'
import {nameToIcon, nameToColor} from '../utils'
import animalApis from '../animalApis'
import element from 'vdux/element'
import {addCode} from '../actions'
import reduce from '@f/reduce'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {active, type, startAddLoop, selectedLine, editorActions = {}} = props
  const {incrementLine = () => {}} = editorActions
  const addCodeHandler = editorActions.addCode || addCode
  const docs = type ? animalApis[type].docs : {}

  return (
    <Block column align='start center' wide tall>
      {reduce((arr, val, key) => [...arr, createButton(key, val)], [], docs)}
    </Block>
  )

  function createButton (name, doc) {
    const args = doc.args
      ? doc.args.map((a) => a.default || '').join(',')
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
        onClick={getClickHandler(active, name, args)}>
        <Icon bold fs='30px' name={nameToIcon(name)} color={nameToColor(name)}/>
      </Button>
    )
  }

  function getClickHandler (active, name, args) {
    if (name === 'comment') {
      return () => [addCodeHandler({id: active, code: '// comment', selectedLine}), incrementLine()]
    } else if (name === 'loop') {
      return () => [addCodeHandler({id: active, code: `loop(1, function () {`, selectedLine}), startAddLoop(), incrementLine()]
    } else {
      return () => [addCodeHandler({id: active, code: `${name}(${args})`, selectedLine}), incrementLine()]
    }
  }
}

export default {
  render
}
