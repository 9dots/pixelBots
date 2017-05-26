/**
 * Imports
 */

import PlaylistItem from 'components/PlaylistItem'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import sort from 'lodash/orderBy'
import {Block} from 'vdux-ui'

/**
 * <Playlist Feed/>
 */

export default component({
  render ({props}) {
	  const {playlists, color} = props
	  const items = mapValues((p, key) => ({ref: key, lastEdited: p.lastEdited}), playlists)
	  const sorted = sort(items, 'lastEdited', 'desc')
	  // if (items.length < 1) {
	  //   return <Empty />
	  // }
	  return (
	    <Block wide column align='center center'>
	      {
	        sorted.map((playlist) => <PlaylistItem
	          key={playlist.ref}
	          color={color}
	          playlistRef={playlist.ref} />)
	      }
	    </Block>
	  )
  }
})
