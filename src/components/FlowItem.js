/** @jsx element */

import element from 'vdux/element'
import {Block, MenuItem} from 'vdux-containers'

function render ({props}) {
  const {active, onClick, label, lastItem, isComplete, ...restProps} = props

  return (
    <Block
      cursor='pointer'
      align='center center'
      onClick={() => onClick(label)}
      {...restProps}>
      <MenuItem
        pill
        px='1em'
        py='0.5em'
        bgColor={isComplete ? 'blue' : 'transparent'}
        color={getColor()}
        borderWidth='2px'
        borderStyle='solid'
        borderColor={isComplete || active ? 'blue' : '#666'}>
        {label}
      </MenuItem>
      {
        !lastItem && <Block
          w='30px'
          h='2px'
          bgColor={isComplete ? 'blue' : '#666'}/>
      }
    </Block>
  )

  function getColor () {
    if (isComplete) return 'white'
    if (active) return 'blue'
    return 'inherit'
  }
}

export default {
  render
}
