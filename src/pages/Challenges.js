import ChallengeItem from '../components/ChallengeItem'
import mapValues from '@f/map-values'
import element from 'vdux/element'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {items = {}} = props
  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])

  return (
    <Block border='1px solid #e0e0e0' borderWidth='0 1px'>
      {sortedItems.map((game) => (
        <ChallengeItem
          key={game.gameRef}
          shared={game.linkRef}
          link={game.saveLink}
          saveRef={game.saveRef}
          gameRef={game.gameRef} />
			))}
    </Block>
  )
}

export default {
  render
}
