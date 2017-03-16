/**
 * Imports
 */

import {Block, Text, Icon} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * <Sort Header/>
 */

export default component({
  render ({props}) {
		const {label, dir, ...restProps} = props
	  return (
	    <Block
	      userSelect='none'
	      color={dir ? '#333' : '#999'}
	      align='start center'
	      cursor='pointer'
	      {...restProps}>
	      <Text lineHeight='1.4em'>{label}</Text>
	      {dir && <Icon
	        mb='1px'
	        ml='5px'
	        fs='s'
	        transition='transform 0.2s ease-in-out'
	        transform={dir === 'desc' ? 'rotate(-180deg)' : 'rotate(0deg)'}
	        name='arrow_downward'/>}
	    </Block>
	  )
  }
})
