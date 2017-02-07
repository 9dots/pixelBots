/**
 * Imports
 */

import ShowcaseItem from 'components/ShowcaseItem'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Showcase View/>
 */

export default component({
  render ({props}) {
    const {playlists, color} = props
    return (
      <Block column align='center center'>
        {playlists.map((playlist) => <ShowcaseItem color={color} playlistRef={playlist}/>)}
      </Block>
    )
  }
})
