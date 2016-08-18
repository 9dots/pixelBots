/** @jsx element */

import element from 'vdux/element'
import {Block, Button, Icon} from 'vdux-containers'
import PaintButton from './PaintButton'
import * as animalApis from '../animalApis/index'
import {nameToIcon} from '../utils'
import TurtleCompass from './TurtleCompass'
import Runner from './Runner'

import {
  addCode
} from '../actions'

function render ({props}) {
  const {active, type, running} = props
  const api = animalApis[type](active)
  const tools = Object.keys(api).filter((name) => name !== 'paint')

  return (
    <Block relative bgColor='#7689A9' column align='start center' p='10px' tall>
      {type === 'turtle' ? <TurtleCompass h='80px' w='80px' active={active}/> : null}
      <PaintButton h='80px' w='80px' clickHandler={(color) => addCode(active, `paint('${color}')`)}/>
      <Runner absolute bottom='0' wide running={running} h='10%'/>
    </Block>
  )
}

export default {
  render
}
