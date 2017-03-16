/**
 * Imports
 */


import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Icon} from 'vdux-ui'

/**
 * <Icon Button/>
 */

export default component({
  render ({props}) {
	  const {iconProps, name, onClick = {}, ...restProps} = props
	  return (
	    <Button
	      borderWidth='0'
	      boxShadow='0'
	      bgColor='#FAFAFA'
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
})
