/** @jsx element */

import element from 'vdux/element'
import {Button, Icon} from 'vdux-containers'
import {Block} from 'vdux-ui'
import {nameToIcon} from '../utils'
import {addCode} from '../actions'

function render ({props}) {
  const {active, h, w} = props
  return (
    <Block w={w} column align='start center'>
      {createButton('up')}
      {createButton('left')}
      {createButton('right')}
      {createButton('down')}
    </Block>
  )

  function createButton (name) {
    return (
      <Button
        hoverProps={{highlight: true, boxShadow: '0 2px 5px 0px rgba(0,0,0,0.6)'}}
        w={w}
        h={h}
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
