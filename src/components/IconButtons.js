/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Compass from './Compass'
import PaintButton from './PaintButton'
import {addCode} from '../actions'
import animalApis from '../animalApis/index'
import {Button, Icon} from 'vdux-containers'
import {nameToIcon} from '../utils'
import reduce from '@f/reduce'

function render ({props}) {
  const {active, type} = props
  const docs = animalApis.docs[type]

  return (
    <Block column align='start center' wide tall>
      {reduce((arr, val, key) => [...arr, createButton(key)], [], docs)}
    </Block>
  )

  function createButton (name) {
    return (
      <Button
        hoverProps={{highlight: true, boxShadow: '0 2px 5px 0px rgba(0,0,0,0.6)'}}
        wide
        h='40px'
        m='5px'
        fs='14px'
        bgColor='primary'
        align='center center'
        boxShadow='0 2px 5px 0px rgba(0,0,0,.8)'
        transition='all .3s ease-in-out'
        onClick={() => [addCode(active, `${name}()`)]}>
        <Icon bold fs='30px' name={nameToIcon(name)} />
      </Button>
    )
  }
}

export default {
  render
}
