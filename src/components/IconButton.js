
/** @jsx element */

import {Button} from 'vdux-containers'
import element from 'vdux/element'
import {Icon} from 'vdux-ui'

function render ({props}) {
  const {iconProps, name, onClick = () => {}, ...restProps} = props
  return (
    <Button
      borderWidth='0'
      boxShadow='0'
      bgColor='#e5e5e5'
      color='#666'
      align='center center'
      onClick={onClick}
      hoverProps={{color: '#333'}}
      circle='40px'
      {...restProps}>
      <Icon name={name} {...iconProps}/>
    </Button>
  )
}

export default {
  render
}
