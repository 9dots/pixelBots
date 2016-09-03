/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-containers'
import PaintButton from './PaintButton'
// import * as animalApis from '../animalApis/index'
import TurtleCompass from './TurtleCompass'
import Runner from './Runner'

import {
  addCode
} from '../actions'

function render ({props}) {
  const {active, type, running, hasRun} = props
  // const api = animalApis[type](active)
  // const tools = Object.keys(api).filter((name) => name !== 'paint')

  return (
    <Block minWidth='200px' relative bgColor='#7689A9' tall>
      <Block relative top='0' wide h='10%'>
        <Runner wide relative running={running} hasRun={hasRun} />
      </Block>
      <Block column align='start center' wide h='90%' p='10px' top='10%'>
        {type === 'turtle' ? <TurtleCompass h='80px' w='80px' active={active}/> : null}
        <PaintButton h='80px' w='80px' clickHandler={(color) => addCode(active, `paint('${color}')`)}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
