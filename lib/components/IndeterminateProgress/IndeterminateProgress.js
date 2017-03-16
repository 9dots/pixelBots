/**
 * Imports
 */

import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Indeterminate Progress/>
 */

export default component({
  render ({props}) {
    let {bgColor = 'green'} = props
    return (
      <Block
        wide
        h='2px'
        absolute
        top='0'
        left='0'
        transition='all .5s ease-in-out'
        bgColor='lightgray'
        overflow='hidden'
        {...props}>
        <Block w='100%' tall class='progress-bar' bgColor={bgColor} />
      </Block>
    )
  }
})
