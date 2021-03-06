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
    		orderedItems.map((item, i) => (
		    	item.type === 'game'
		    		? <ChallengeItem
			          key={item.saveRef}
			          shared={item.linkRef}
			          completed={completed}
			          link={item.saveLink}
			          saveRef={item.saveRef}
			          gameRef={item.gameRef} />
		        : <PlaylistItem
			          key={item.playlistKey}
			          clickHandler={context.setUrl(`/playlist/${item.playlistKey}/${i}`)}
			          lastEdited={item.lastEdited}
			          playlistRef={item.playlistKey} />
		  	))
    	}
  	</Block>
  }
})