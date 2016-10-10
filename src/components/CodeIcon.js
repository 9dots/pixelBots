/** @jsx element */

import {removeLine, updateLine} from '../actions'
import animalApis from '../animalApis/index'
import IconArgument from './IconArgument'
import {Icon, Button, IconButton, Block} from 'vdux-containers'
import ColorPicker from './ColorPicker'
import LineNumber from './LineNumber'
import element from 'vdux/element'

function render ({props}) {
  let {
    shouldTransition,
    newElement,
    argument,
    numLines,
    iconName,
    lineNum,
    animal,
    type,
    name,
    fs
  } = props
  const shouldFlash = !shouldTransition && newElement
  const api = animalApis.docs[type]

  function getButton (name) {
    return (
      <Icon
        fs='40px'
        h='40px'
        w='40px'
        align='center center'
        name={name}
        color='white'
      />
    )
  }

  return (
    <Block relative wide>
      <Block
        relative
        {...props}
        class={[shouldFlash && 'flash']}
        align='center center'>
        <LineNumber fs='22px' absolute textAlign='right' numLines={numLines} lineNum={lineNum + 1} />
        <Block align='center center'>
          <Icon fs={fs} name={iconName}/>
          {api[name].arguments && api[name].arguments.map((arg, i) => (
            <IconArgument
              argument={argument.split(',')[i]}
              changeHandler={(val) => updateLine(animal, lineNum, `${name}(${val})`)}
              type={arg}/>
          ))}
        </Block>
      </Block>
      <Block align='center center' absolute right='0' top='5px'>
        <Icon
          color='#666'
          name='delete'
          onClick={[(e) => e.stopPropagation(), () => removeLine(animal, lineNum)]}/>
      </Block>
    </Block>
  )
}

export default {
  render
}
