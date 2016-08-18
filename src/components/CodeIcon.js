/** @jsx element */

import element from 'vdux/element'
import {Icon, Block, Button, Text, wrap, CSSContainer} from 'vdux-containers'
import ColorPicker from './ColorPicker'
import {removeLine, updateLine} from '../actions'
import {nameToDirection} from '../utils'
import createAction from '@f/create-action'
import Outline from './Outline'
import Delay from 'vdux-delay'

function render ({props}) {
  let {
    fs,
    name,
    iconName,
    show,
    lineNum,
    id,
    color,
    type,
    focus,
    h,
    w,
    shouldTransition,
    newElement
  } = props
  let opacity = 0
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
      mt={focus ? `${parseInt(h) + 8}px` : '4px'}
      transition={shouldTransition ? 'margin .3s ease-in-out': ''}
      {...props}>
      {iconName === 'brush' ? (
        <ColorPicker
          btn={getButton(iconName)}
          clickHandler={(newColor) => updateLine(id, lineNum, `paint('${newColor}')`)}/>
      ) : (
        <Icon fs={fs} name={iconName}/>
      )}
      {focus && <Block align='center center' absolute right='2%'>
        <Icon
          tall
          fs='40px'
          onClick={() => removeLine(id, lineNum)}
          transition='opacity .3s ease-in-out'
          color='black'
          name='delete'/>
      </Block>}
      {focus && (
        <div>
          <Outline opacity={0} transition='opacity .3s ease-in-out' absolute top={`-${parseInt(h) + 4}px`} h={h} wide border='2px dashed black'/>
          <Delay time={300}>
            <Outline opacity={1} left='0' transition='opacity .3s ease-in-out' absolute top={`-${parseInt(h) + 4}px`} h={h} wide border='2px dashed black'/>
          </Delay>
        </div>

      )}
    </Block>
  )
}

export default {
  render
}
