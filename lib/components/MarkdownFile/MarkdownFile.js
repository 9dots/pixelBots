/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Terms/>
 */

export default component({
  render ({props}) {
    const {html} = props
    return (
      <Block
        fontFamily='Lato'
        fs='15px'
        fontWeight='300'
        id='terms'
        lh='1.8em'
        w='60%'
        m='32px'
        innerHTML={html} />
    )
  }
})
