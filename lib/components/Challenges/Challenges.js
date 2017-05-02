/**
 * Imports
 */

import ChallengeItem from 'components/ChallengeItem'
import {component, element} from 'vdux'
import Button from 'components/Button'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'

/**
 * <Challenges/>
 */

export default component({
  render ({props, children}) {
		const {items = {}, completed} = props
	  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])
	  return (
	    <Block>
	      {sortedItems.map((game) => (
	        <ChallengeItem
	          key={game.gameRef}
	          shared={game.linkRef}
	          completed={completed}
	          link={game.saveLink}
	          saveRef={game.saveRef}
	          gameRef={game.gameRef} >
          </ChallengeItem>
				))}
	    </Block>
	  )
  }
})
