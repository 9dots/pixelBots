/** @jsx element */

import {removeLine} from '../actions'
import element from 'vdux/element'
import {Block, Icon} from 'vdux-ui'

function render ({props}) {
  const {lineNum, numLines, active, animalID, editorActions = {}} = props
  const digits = numLines.toString().length
  const offset = digits * 6

  const handleRemoveLine = editorActions.removeLine || removeLine

  return (
    <Block mt='5px' color='#333' {...props} w='30px' left={`${offset}px`}>
      {
      	active
      		? <Block align='center center' ml='18px'>
      				<Icon
              	color='#666'
              	name='delete'
              	onClick={[(e) => e.stopPropagation(), () => handleRemoveLine({id: animalID, idx: lineNum - 1})]}/>
             </Block>
          : lineNum
      }
    </Block>
  )
}

export default {
  render
}
