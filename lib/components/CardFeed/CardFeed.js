/**
 * Imports
 */

import DisplayCard from 'components/DisplayCard'
import {component, element} from 'vdux'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'


/**
 * <Card Feed/>
 */

export default component({
  render ({props}) {
    const {items = {}, imageSize, userProfile, username, profileName} = props
	  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])
	  return (
	    <Block m='1em auto'>
	      {sortedItems.map((game) => (
	        <DisplayCard
	          imageSize={imageSize}
	          userProfile={userProfile}
	          mine={username === profileName}
	          m='0 auto'
	          mb='40px'
	          key={`display-card-${game.saveRef}`}
	          saveRef={game.saveRef}
	          gameRef={game.gameRef} />
				))}
	    </Block>
	  )
  }
})
