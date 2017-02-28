import VirtualList from 'vdux-virtual-list'
import element from 'vdux/element'

const List = (InnerList, items, opts = {}) => {
  return {
    render () {
      const {height = 50, buffer = 10, container = window} = opts
      const itemHeight = height
      const itemBuffer = buffer
      const MyVirtualList = VirtualList({container: container})(InnerList)
      return (
        <MyVirtualList
          itemHeight={itemHeight}
          itemBuffer={itemBuffer}
          items={items} />
      )
    }
  }
}

export default List
