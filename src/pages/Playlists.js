import PlaylistItem from '../components/PlaylistItem'
import {setUrl} from 'redux-effects-location'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
  const {items = {}} = props
  const sortedItems = orderBy(items, ['lastEdited'], ['desc'])

  return (
    <Block>
      {sortedItems.map((playlist) => (
        <PlaylistItem
          key={playlist.playlistKey}
          clickHandler={() => setUrl(`/playSequence/${playlist.playlistKey}`)}
          lastEdited={playlist.lastEdited}
          playlistRef={playlist.playlistKey} />
			))}
    </Block>
  )
}

export default {
  render
}
