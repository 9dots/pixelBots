import VirtualList from 'vdux-virtual-list'
import element from 'vdux/element'

let virtualList = {}

function render ({props}) {
  const {innerList, items, height = 50, buffer = 10, container = window} = props
  if (!virtualList[container]) {
    virtualList[container] = VirtualList({container: container})
  }
  const MyVirtualList = virtualList[container]
  return (
    <MyVirtualList
      key='virtual-list-1'
      itemHeight={height}
      itemBuffer={buffer}
      InnerComponent={innerList}
      items={items} />
  )
}

// const List = (InnerList, items, opts = {}) => {
//   return {
//     shouldUpdate (prev, next) {
//       console.log(prev.props, next.props)
//     },
//     onCreate () {
//       console.log('create')
//     },
//     render () {
//       const {height = 50, buffer = 10, container = window} = opts
//       const itemHeight = height
//       const itemBuffer = buffer
//       const MyVirtualList = VirtualList({container: container})(InnerList)
//       return (
//         <MyVirtualList
//           key='virtual-list-1'
//           itemHeight={itemHeight}
//           itemBuffer={itemBuffer}
//           items={items} />
//       )
//     }
//   }
// }

export default {
  render
}
