/**
 * Imports
 */

import VirtualList from 'vdux-virtual-list'
import {component, element} from 'vdux'
import pick from '@f/pick'

/**
 * <Virtual List/>
 */

export default component({
  render ({props}) {
    const {InnerList, items, opts = {}, childProps} = props
		const {height = 50, buffer = 10, container = window} = opts
    const itemHeight = height
    const itemBuffer = buffer

    if (!opts.container) return <span/>

    return (
      <VirtualList
        childProps={childProps}
        container={container}
        options={opts}
        key='my-virtual-list'
        itemHeight={itemHeight}
        itemBuffer={itemBuffer}
        InnerComponent={InnerList}
        items={items} />
    )
  }
})
