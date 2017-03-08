/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import {swapMode, refresh, setPlaylistKey} from '../actions'
import {immediateSave} from '../middleware/saveCode'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import Playlist from './Playlist'

const isLoading = createAction('<PlaylistLoader/>: IS_LOADING')

const initialState = ({local}) => ({
  loading: false,
  actions: {isLoading: local(isLoading)}
})

function * onCreate ({props}) {
  yield setPlaylistKey(props.playlistRef)
}

function render ({props, state, local}) {
  const {list, playlist, myList} = props
  const {loading, actions} = state

  if (list.loading || playlist.loading || myList.loading || loading) return <IndeterminateProgress />

  const mergeList = {...myList.value, ...playlist.value}
  const activeList = list.value ? list.value : mergeList

  const currentPath = props.ref === 'nothing'
    ? `/users/${props.uid}/lists/${props.playlistRef}`
    : `/savedList/${props.ref}`

  const {sequence, current = 0} = activeList
  window.getPlaylistRef = () => activeList.assignmentRef
  return (
    <Playlist current={current} {...props} listRef={props.ref} {...activeList} next={next} prev={prev} />
  )

  function * next () {
    if (current + 1 < sequence.length) {
      yield immediateSave()
      yield actions.isLoading(true)
      yield refresh()
      yield refMethod({
        ref: currentPath,
        updates: {method: 'update', value: {lastEdited: Date.now()}}
      })
      yield refMethod({
        ref: currentPath + '/current',
        updates: {method: 'transaction', value: (val) => val + 1}
      })
      yield actions.isLoading(false)
    }
  }

  function * prev () {
    if (current - 1 >= 0) {
      yield immediateSave()
      yield actions.isLoading(true)
      yield refresh()
      yield refMethod({
        ref: currentPath + '/current',
        updates: {method: 'transaction', value: (val) => val - 1}
      })
      yield refMethod({
        ref: currentPath,
        updates: {method: 'update', value: {lastEdited: Date.now()}}
      })
      yield actions.isLoading(false)
    }
  }
}

function * onRemove () {
  yield setPlaylistKey(null)
}

const reducer = handleActions({
  [isLoading.type]: (state, payload) => ({...state, loading: payload})
})

export default fire((props) => ({
  list: `/savedList/${props.ref}`,
  myList: `/users/${props.uid}/lists/${props.playlistRef}`,
  playlist: {ref: `/playlists/${props.playlistRef}`, type: 'once'}
}))({
  initialState,
  onCreate,
  onRemove,
  reducer,
  render
})
