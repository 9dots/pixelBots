/**
 * Imports
 */

import PlaylistItem from 'components/PlaylistItem'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Showcase View/>
 */

export default component({
  render ({props, context}) {
    const {playlists, color} = props
    console.log(playlists)
    return (
      <Block maxWidth={920} minWidth={800} pb='xl' px m='0 auto' column align='center center'>
        {playlists.map((playlist) => <PlaylistItem uid={context.uid} color={color} playlistRef={playlist} />)}
      </Block>
    )
  }
})
