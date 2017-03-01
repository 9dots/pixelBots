import {setModalMessage, clearMessage} from '../actions'
import {Dropdown, MenuItem, Icon} from 'vdux-containers'
import CreatePlaylist from './CreatePlaylist'
import {Block} from 'vdux-ui'
import element from 'vdux/element'
import {addToPlaylist} from '../utils'
import reduce from '@f/reduce'

function render ({props}) {
  const {uid, playlists, gameRef, gameName} = props
  return (
    <Dropdown zIndex='999' btn={<Icon hoverProps={{color: '#333'}} color='#666' mt='4px' cursor='pointer' name='add' />}>
      <Block onScroll={(e) => [e.stopPropagation(), e.preventDefault()]} maxHeight='300px' py='10px' w='200px' overflowY='auto'>
        <MenuItem
          fontWeight='300'
          wide
          fs='s'
          onClick={[(e) => e.stopPropagation(), () => setModalMessage(setCreatePlaylist())]}>
          New Playlist
        </MenuItem>
        {reduce((cur, playlist, key) =>
          cur.concat(<MenuItem
            fontWeight='600'
            onClick={[(e) => e.stopPropagation(), () => addToPlaylist(playlist.ref, playlist.name, [gameRef], gameName)]}
            wide>{playlist.name}</MenuItem>), [], playlists)}
      </Block>
    </Dropdown>
  )

  function setCreatePlaylist () {
    return <CreatePlaylist
      uid={uid}
      handleDismiss={clearMessage} />
  }
}

function getProps (props, context) {
  return {
    ...props,
    uid: context.uid,
    playlists: context.profile.playlists
  }
}

export default {
  getProps,
  render
}
