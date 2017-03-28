/** @jsx element */

import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * App
 */

export default component({
  render ({props, children}) {
    return (
      <Block
        fixed
        h='100vh'
        w='70px'
        left='0'
        zIndex='999'
        // boxShadow='0 0 4px rgba(81, 82, 81, 0.3)'
        borderRight='1px solid divider'
        bgColor='white'
        color='#FAFAFA'
        px='10px'
        column
        align='center center'
        {...props}>
        {children}
      </Block>
    )
  }
})
