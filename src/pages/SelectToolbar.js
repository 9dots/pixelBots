/** @jsx element */

import {Block, Icon, Flex, Text} from 'vdux-ui'
import CreatePlaylist from '../components/CreatePlaylist'
import {Dropdown, MenuItem} from 'vdux-containers'
import createAction from '@f/create-action'
import {setToast} from '../actions'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import Window from 'vdux/window'
import reduce from '@f/reduce'
import handleActions from '@f/handle-actions'
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
  const {num, uid, selected, clearSelected, playlists = []} = props
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
          left={position === 'fixed' ? '90px' : '0'}
          w={position === 'fixed' ? 'calc(100% - 90px)' : '100%'}
          h='42px'
          bgColor='red'
          align='start center'>
          <Block flex align='start center'>
            <Icon cursor='pointer' mr='20px' name='close' onClick={clearSelected} />
            <Text fontWeight='800'>{num} selected</Text>
          </Block>
          <Block align='center center'>
            <Dropdown zIndex='999' btn={<Icon mt='4px' cursor='pointer' name='add' />}>
              <Block maxHeight='300px' py='10px' w='150px' overflowY='auto'>
                <MenuItem fontWeight='300' wide onClick={local(setModal)}>New Playlist</MenuItem>
                {reduce((cur, playlist, key) => cur.concat(<MenuItem fontWeight='600' onClick={() => addToPlaylist(playlist.ref, playlist.name)} wide>{playlist.name}</MenuItem>), [], playlists)}
              </Block>
            </Dropdown>
          </Block>
          {modal && <CreatePlaylist
            uid={uid}
            selected={selected}
            handleDismiss={local(clearModal)}
            onAddToPlaylist={clearSelected} />
					}
        </Flex>
        {position === 'fixed' && <Block wide h='42px' />}
      </Block>
    </Window>
  )

  function * maybeFixed (e) {
    if (e.target.scrollTop > 100) {
      yield actions.setFixed()
    } else {
      yield actions.setRelative()
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
}

const reducer = handleActions({
  [setModal]: (state) => ({...state, modal: true}),
  [clearModal]: (state) => ({...state, modal: ''}),
  [setFixed]: (state) => ({...state, position: 'fixed'}),
  [setRelative]: (state) => ({...state, position: 'relative'})
})

export default {
  initialState,
  reducer,
  render
}
