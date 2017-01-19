/** @jsx element */

import {updateLine, codeAdded} from '../actions'
import animalApis from '../animalApis/index'
import {Icon, Block} from 'vdux-containers'
import deepEqual from '@f/deep-equal'
import IconArgument from './IconArgument'
import {nameToColor} from '../utils'
import element from 'vdux/element'
import omit from '@f/omit'

function shouldUpdate (prev, next) {
  return !deepEqual(omit('editorActions', prev.props), omit('editorActions', next.props)) ||
  !deepEqual(prev.children, next.children)
}

function onCreate ({props}) {
  const handleCodeAdded = props.editorActions.codeAdded || codeAdded
  return handleCodeAdded()
}

function render ({props}) {
  let {
    shouldTransition,
    editorActions,
    newElement,
    argument,
    iconName,
    lineNum,
    animal,
    type,
    name,
    fs
  } = props

  const handleUpdateLine = editorActions.updateLine || updateLine

  const shouldFlash = !shouldTransition && newElement
  const docs = animalApis[type].docs
  const args = docs[name] ? docs[name].args : []

  return (
    <Block relative wide>
      <Block
        relative
        {...props}
        class={[shouldFlash && 'flash']}
        align='center center'>
        <Block align='center center'>
          <Icon fs={fs} name={iconName} color={nameToColor(name)}/>
          {
            args && args.map((arg, i) => (
              <IconArgument
                argument={argument.split(',')[i]}
                changeHandler={(val) => (
                  handleUpdateLine({id: animal, lineNum, code: `${name}(${val})`})
                )}
                arg={arg}/>
          ))}
        </Block>
      </Block>
    </Block>
  )
}

export default {
  shouldUpdate,
  onCreate,
  render
}
