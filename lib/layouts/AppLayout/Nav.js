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
        w='90px'
        left='0'
        zIndex='999'
        boxShadow='0px 2px 4px -2px rgba(0,0,0,0.8)'
        bgColor='#666'
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
