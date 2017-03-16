/**
 * Imports
 */

import PlaylistItem from 'components/PlaylistItem'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import {Block} from 'vdux-ui'


/**
 * <Playlists/>
 */

export default component({
  render ({props, context}) {
	  const {items = {}} = props
	  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])

	  return (
	    <Block>
	      {sortedItems.map((playlist) => (
	        <PlaylistItem
	          key={playlist.playlistKey}
	          clickHandler={context.setUrl(`/playSequence/${playlist.playlistKey}`)}
	          lastEdited={playlist.lastEdited}
	          playlistRef={playlist.playlistKey} />
				))}
	    </Block>
	  )
  }
})
