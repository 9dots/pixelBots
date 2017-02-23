/** @jsx element */

import PlaylistItem from '../components/PlaylistItem'
import mapValues from '@f/map-values'
import element from 'vdux/element'
import sort from 'lodash/orderBy'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {playlists, color} = props
  const items = mapValues((p) => ({ref: p.ref, lastEdited: p.lastEdited}), playlists)
  const sorted = sort(items, 'lastEdited', 'desc')
  return (
    <Block wide column align='center center'>
      {
        sorted.map((playlist) => <PlaylistItem
        key={playlist.ref}
        color={color}
        playlistRef={playlist.ref}/>)
      }
    </Block>
  )
}

export default {
  render
}
