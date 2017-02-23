/** @jsx element */

import {wrap, CSSContainer} from 'vdux-containers'
import {Block, Checkbox, Image} from 'vdux-ui'
import element from 'vdux/element'

function render ({props}) {
  const {
    hovering,
    imageUrl,
    isSelected,
    onSelect,
    ref,
    selectMode,
    hoverItem,
    ...restProps
  } = props

  return (
    <Block mr='2em' sq='50px' align='center center'>
      {
        (hovering || selectMode)
          ? hoverItem || getCheckBox()
          : <Image
              sq='50px'
              display='block'
              src={imageUrl}/>
      }
    </Block>
  )

  function getCheckBox () {
    return (
      <Checkbox
        mr='-8px'
        checkProps={{sq: '24px', fs: '20px'}}
        cursor='pointer'
        checked={isSelected}
        transition='all .2s ease-in-out'
        onClick={(e) => e.stopPropagation()}
        onChange={() => onSelect(ref)} />
    )
  }
}

export default wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})({
  render
})

