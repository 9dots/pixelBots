/** @jsx element */

import ShowcaseItem from '../components/PlaylistItem'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {playlists, color} = props
  return (
    <Block px='10px' wide column align='center center'>
      {playlists.map((playlist) => <ShowcaseItem color={color} playlistRef={playlist}/>)}
    </Block>
  )
}

export default {
  render
}
