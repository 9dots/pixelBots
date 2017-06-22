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
	      {sortedItems.map((playlist, i) => (
	        <PlaylistItem
	          key={playlist.playlistKey}
	          clickHandler={context.setUrl(`/playlist/${playlist.playlistKey}/${i}`)}
	          lastEdited={playlist.lastEdited}
	          playlistRef={playlist.playlistKey} />
				))}
	    </Block>
	  )
  }
})
