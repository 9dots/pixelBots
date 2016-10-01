/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Compass from './Compass'
import PaintButton from './PaintButton'
import {addCode} from '../actions'
import * as animalApis from '../animalApis/index'

function render ({props}) {
  const {active, type} = props
  const animal = animalApis[type](active)
  const canPickColor = animal.docs['paint'].arguments !== undefined

  return (
    <Block column align='start center' wide tall>
      <Compass h='80px' w='80px' active={active}/>
      <PaintButton
        h='80px'
        w='80px'
        colorPicker={canPickColor}
        clickHandler={(color) => addCode(active, `paint('${color}')`)}/>
    </Block>
  )
}

export default {
  render
}
