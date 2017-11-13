/**
 * Imports
 */

import PlaylistItem from 'components/PlaylistItem'
import { component, element } from 'vdux'
import mapValues from '@f/map-values'
import sort from 'lodash/orderBy'
import { Block } from 'vdux-ui'

/**
 * <Playlist Feed/>
 */

export default component({
  render ({ props }) {
    const { playlists, color, hideProgress, shouldSort = true } = props

    const items = mapValues(
      (p, key) => ({ ref: p.ref || key, lastEdited: p.lastEdited }),
      playlists
    )
    const sorted = shouldSort ? sort(items, 'lastEdited', 'desc') : items

    return (
      <Block wide column align='center center'>
        {sorted.map(playlist => (
          <PlaylistItem
            hideProgress={hideProgress}
            key={playlist.ref}
            color={color}
            playlistRef={playlist.ref} />
        ))}
      </Block>
    )
  }
})
