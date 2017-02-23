/** @jsx element */

import CreatePlaylist from '../components/CreatePlaylist'
import ConfirmDelete from '../components/ConfirmDelete'
import {Dropdown, MenuItem} from 'vdux-containers'
import {Block, Icon, Flex, Text} from 'vdux-ui'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {setToast} from '../actions'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import Window from 'vdux/window'
import filter from '@f/filter'
import reduce from '@f/reduce'
import sleep from '@f/sleep'

const setModal = createAction('<SelectToolbar/>: SET_MODAL')
const clearModal = createAction('<SelectToolbar/>: CLEAR_MODAL')
const setFixed = createAction('<SelectToolbar/>: SET_FIXED')
const setRelative = createAction('<SelectToolbar/>: SET_RELATIVE')

const initialState = ({local}) => ({
  modal: '',
  playlistName: '',
  position: getInitialPosition(document.getElementsByClassName('action-bar-holder')[0]),
  actions: {
    setFixed: local(setFixed),
    setRelative: local(setRelative)
  }
})

function getInitialPosition (target) {
  if (target.scrollTop > 100) {
    return 'fixed'
  } else {
    return 'relative'
  }
}

function render ({props, local, state}) {
  const {num, uid, selected, clearSelected, playlists = [], mine} = props
  const {modal, actions, playlistName, position} = state

  return (
    <Window onScroll={maybeFixed}>
      <Block>
        <Flex
          position={position}
          px='20px'
          top='0'
          color='white'
          zIndex='999'
          left={position === 'fixed' ? '80px' : '0'}
          w={position === 'fixed' ? 'calc(100% - 80px)' : '100%'}
          h='42px'
          bgColor='blue'
          align='start center'>
          <Block flex align='start center'>
            <Icon cursor='pointer' mr='20px' name='close' onClick={clearSelected} />
            <Text fontWeight='800'>{num} selected</Text>
          </Block>
          <Block align='center center'>
            <Dropdown zIndex='999' btn={<Icon mt='4px' cursor='pointer' name='add' />}>
              <Block onScroll={(e) => [e.stopPropagation(), e.preventDefault()]} maxHeight='300px' py='10px' w='150px' overflowY='auto'>
                <MenuItem
                  fontWeight='300'
                  wide
                  onClick={local(() => setModal(setCreatePlaylist()))}>
                  New Playlist
                </MenuItem>
                {reduce((cur, playlist, key) =>
                  cur.concat(<MenuItem
                    fontWeight='600'
                    onClick={() => addToPlaylist(playlist.ref, playlist.name)}
                    wide>{playlist.name}</MenuItem>), [], playlists)}
              </Block>
            </Dropdown>
            <MenuItem
              ml='0.5em'
              align='center center'
              bgColor='blue'
              circle='25px'
              hoverProp={{hightlight: true}}
              onClick={local(() => setModal(setConfirmDelete()))}>
              <Icon color='white' name='delete' />
            </MenuItem>
          </Block>
          {modal && modal}
        </Flex>
        {position === 'fixed' && <Block wide h='42px' />}
      </Block>
    </Window>
  )

  function setConfirmDelete () {
    return <ConfirmDelete
      action={() => removeChallenges(selected)}
      header='Unfollow?'
      dismiss={local(clearModal)}
      message={`${selected.length} ${pluralize('playlist', selected.length)}`}
    />
  }

  function setCreatePlaylist () {
    return <CreatePlaylist
      uid={uid}
      selected={selected}
      handleDismiss={local(clearModal)}
      onAddToPlaylist={clearSelected} />
  }

  function * maybeFixed (e) {
    if (e.target.className.indexOf('action-bar-holder') > -1) {
      if (e.target.scrollTop > 100) {
        yield actions.setFixed()
      } else {
        yield actions.setRelative()
      }
    }
  }

  function * addToPlaylist (code, name) {
    yield refMethod({
      ref: '/queue/tasks/',
      updates: {
        method: 'push',
        value: {
          _state: 'add_to_playlist',
          newGames: selected,
          playlist: code
        }
      }
    })
    yield setToast(`${selected.length} added to ${name}`)
    yield clearSelected()
    yield sleep(3000)
    yield setToast('')
  }

  function * removeChallenges () {
    const snap = yield refMethod({
      ref: `/users/${uid}/games`,
      updates: {
        method: 'once',
        value: 'value'
      }
    })
    const filtered = filter((game) => selected.indexOf(game.ref) > -1, snap.val())
    for (let key in filtered) {
      yield removeChallenge(key)
    }
    yield clearSelected()
  }

  function * removeChallenge (key) {
    yield refMethod({
      ref: `/users/${uid}/games/${key}`,
      updates: { method: 'remove' }
    })
  }
}

const pluralize = (noun, count) => count === 1 ? noun : `${noun}s`

const reducer = handleActions({
  [setModal]: (state, payload) => ({...state, modal: payload}),
  [clearModal]: (state) => ({...state, modal: ''}),
  [setFixed]: (state) => ({...state, position: 'fixed'}),
  [setRelative]: (state) => ({...state, position: 'relative'})
})

export default {
  initialState,
  reducer,
  render
}
