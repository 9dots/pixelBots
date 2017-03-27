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
        w='80px'
        left='0'
        zIndex='999'
        // boxShadow='-1px 0 7px rgba(0,0,0,.3)'
        borderRight='1px solid divider'
        bgColor='white'
        color='#FAFAFA'
        py='10px'
        px='10px'
        column
        align='center center'
        {...props}>
        {children}
      </Block>
    )
  }
})
