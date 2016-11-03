/** @jsx element */

import {removeLine, updateLine, codeAdded} from '../actions'
import animalApis from '../animalApis/index'
import {Icon, Block} from 'vdux-containers'
import IconArgument from './IconArgument'
import {nameToColor} from '../utils'
import LineNumber from './LineNumber'
import element from 'vdux/element'

function onCreate () {
  return codeAdded()
}

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
  const docs = animalApis[type].docs
  const args = docs[name].args

  return (
    <Block relative wide>
      <Block
        relative
        {...props}
        class={[shouldFlash && 'flash']}
        align='center center'>
        <LineNumber fs='22px' absolute textAlign='right' numLines={numLines} lineNum={lineNum + 1} />
        <Block align='center center'>
          <Icon fs={fs} name={iconName} color={nameToColor(name)}/>
          {
            args && args.map((arg, i) => (
              <IconArgument
                argument={argument.split(',')[i]}
                changeHandler={(val) => (
                  updateLine(animal, lineNum, `${name}(${val})`)
                )}
                arg={arg}/>
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
  onCreate,
  render
}
