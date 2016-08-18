/** @jsx element */

import element from 'vdux/element'
import {Icon, Block} from 'vdux-containers'
import ColorPicker from './ColorPicker'
import {removeLine, updateLine} from '../actions'
import LineNumber from './LineNumber'

function render ({props}) {
  let {
    id,
    fs,
    name,
    iconName,
    lineNum,
    animal,
    color,
    focus,
    h,
    shouldTransition,
    newElement,
    numLines,
    removeOutline
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
      mt={focus ? `${parseInt(h) + 8}px` : '4px'}
      transition={shouldTransition ? 'margin .3s ease-in-out' : ''}
      {...props}>
      <LineNumber fs='22px' absolute textAlign='right' numLines={numLines} lineNum={lineNum + 1} />
      {iconName === 'brush' ? (
        <ColorPicker
          btn={getButton(iconName)}
          clickHandler={(newColor) => updateLine(animal, lineNum, `paint('${newColor}')`)}/>
      ) : (
        <Icon fs={fs} name={iconName}/>
      )}
      <Block align='center center' absolute right='2%'>
        <Icon
          tall
          fs='40px'
          onClick={[(e) => e.stopPropagation(), () => removeLine(animal, lineNum), () => removeOutline()]}
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
