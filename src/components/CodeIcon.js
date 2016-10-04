/** @jsx element */

import element from 'vdux/element'
import {Icon, Block} from 'vdux-containers'
import ColorPicker from './ColorPicker'
import {removeLine, updateLine} from '../actions'
import LineNumber from './LineNumber'
import * as animalApis from '../animalApis/index'

function render ({props}) {
  let {
    shouldTransition,
    newElement,
    numLines,
    iconName,
    lineNum,
    animal,
    color,
    type,
    name,
    fs
  } = props
  const shouldFlash = !shouldTransition && newElement

  function getButton (name) {
    return (
      <Icon
        fs='40px'
        h='40px'
        w='40px'
        align='center center'
        name={name}
        color={color}
      />
    )
  }

  return (
    <Block
      relative
      class={[shouldFlash && 'flash']}
      align='center center'
      {...props}>
      <LineNumber fs='22px' absolute textAlign='right' numLines={numLines} lineNum={lineNum + 1} />
      {iconName === 'brush' && animalApis[type](animal).docs.paint.arguments
        ? (
        <ColorPicker
          btn={getButton(iconName)}
          h='40px'
          w='40px'
          clickHandler={(newColor) => updateLine(animal, lineNum, `paint('${newColor}')`)}/>
        ) : (
        <Icon fs={fs} name={iconName}/>
      )}
      <Block align='center center' absolute tall right='2%' top='0'>
        <Icon
          fs={props.fs}
          onClick={[(e) => e.stopPropagation(), () => removeLine(animal, lineNum)]}
          transition='opacity .3s ease-in-out'
          color='black'
          name='delete'/>
      </Block>
    </Block>
  )
}

export default {
  render
}
