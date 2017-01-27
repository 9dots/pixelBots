/** @jsx element */

import ShowcaseItem from './ShowcaseItem'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {playlists, color} = props
  return (
    <Block column align='center center'>
      {playlists.map((playlist) => <ShowcaseItem color={color} playlistRef={playlist}/>)}
    </Block>
  )
}

export default {
  render
}
