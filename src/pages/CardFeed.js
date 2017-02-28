import DisplayCard from '../components/DisplayCard'
import mapValues from '@f/map-values'
import element from 'vdux/element'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {items = {}, w = '500px', imageSize = '500px'} = props
  console.log(items)
  const sortedItems = orderBy(items, ['lastEdited', 'timestamp'], ['desc', 'desc'])
  return (
    <Block m='1em auto'>
      {sortedItems.map((game) => (
        <DisplayCard
          imageSize={imageSize}
          w={w}
          m='0 auto'
          mb='40px'
          saveRef={game.saveRef}
          gameRef={game.gameRef} />
			))}
    </Block>
  )
}

export default {
  render
}
