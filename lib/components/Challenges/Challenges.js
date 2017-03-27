/**
 * Imports
 */

import ChallengeItem from 'components/ChallengeItem'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'

/**
 * <Challenges/>
 */

export default component({
  render ({props}) {
		const {items = {}} = props
	  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])
	  return (
	    <Block>
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
})
