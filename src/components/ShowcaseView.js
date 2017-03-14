/** @jsx element */

import ShowcaseItem from './ShowcaseItem'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {playlists, color} = props
  return (
    <Block w='60%' m='0 auto' column align='center center' borderTop='1px solid #e0e0e0'>
      {playlists.map((playlist) => <ShowcaseItem color={color} playlistRef={playlist} />)}
    </Block>
  )
}

export default {
  render
}
