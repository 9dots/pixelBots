/**
 * Imports
 */

import ChallengeItem from 'components/ChallengeItem'
import PlaylistItem from 'components/PlaylistItem'
import {component, element} from 'vdux'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'

/**
 * <Combo List/>
 */

export default component({
  render ({props, context}) {
  	const {items, completed} = props
  	const orderedItems = orderBy(items, 'lastEdited', 'desc')
    return <Block>
    	{
    		orderedItems.map((item) => (
		    	item.type === 'game'
		    		? <ChallengeItem
			          key={item.gameRef}
			          shared={item.linkRef}
			          completed={completed}
			          link={item.saveLink}
			          saveRef={item.saveRef}
			          gameRef={item.gameRef} />
		        : <PlaylistItem
			          key={item.ref}
			          clickHandler={context.setUrl(`/playSequence/${item.ref}`)}
			          lastEdited={item.lastEdited}
			          playlistRef={item.ref} />
		  	))
    	}
  	</Block>
  }
})