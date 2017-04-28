/**
 * Imports
 */

import VirtualList from 'vdux-virtual-list'
import {component, element} from 'vdux'

/**
 * <Virtual List/>
 */

export default (InnerList, items, opts = {}) => component({
  render ({props}) {
		const {height = 50, buffer = 10, container = window} = opts
    const itemHeight = height
    const itemBuffer = buffer

    const MyVirtualList = VirtualList({container: container})
    return (
      <MyVirtualList
        itemHeight={itemHeight}
        itemBuffer={itemBuffer}
        InnerComponent={InnerList}
        items={items} />
    )
  }
})
