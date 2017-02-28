import {maybeAddToArray, addToPlaylists} from '../utils'
import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import {Block, Menu, Checkbox} from 'vdux-ui'
import createAction from '@f/create-action'
import ModalMessage from './ModalMessage'
import {MenuItem} from 'vdux-containers'
import {clearMessage} from '../actions'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import element from 'vdux/element'
import Loading from './Loading'
import filter from '@f/filter'
import Button from './Button'
import fire from 'vdux-fire'

const checkBoxClick = createAction('<AddToPlaylistModal/>: CHECK_BOX_CLICK')

const initialState = () => ({
  selected: []
})

function render ({props, state, local}) {
  const {myPlaylists, gameID, username, uid, cancel = 'Cancel', onSubmit = () => {}} = props
  const {selected} = state
  const filteredPlaylists = orderBy(filter((playlist) => playlist.creatorID === uid, myPlaylists.value || {}), ['lastEdited'], ['desc'])
  const body = myPlaylists.loading
		? <Loading />
		: (
  <Menu
    border='1px solid #e0e0e0'
    bgColor='#FFF'
    column
    maxHeight='200px'
    overflowY='auto'>
    {mapValues((playlist, key) => <MenuItem align='space-between center'>
      {playlist.name}
      <Checkbox
        checked={selected.indexOf(playlist.ref) > -1}
        onChange={local(() => checkBoxClick(playlist.ref))} />
    	</MenuItem>, filteredPlaylists || {})}
  </Menu>
			)
  const footer = (
    <Block>
      <Button
        onClick={[() => setUrl(`/${username}/authored/challenges`), clearMessage, onSubmit]}
        bgColor='#FAFAFA'
        color='#666'
        fs='s'
        border='none'>{cancel}</Button>
      <Button
        bgColor='blue'
        ml='1em'
        fs='s'
        onClick={[
        	onSubmit,
        	clearMessage,
        	() => addToPlaylists(gameID, selected),
        	() => setUrl(`/${username}/authored/playlists`)]}>
      	Accept
      </Button>
    </Block>
	)
  return (
    <ModalMessage
      bgColor='#FAFAFA'
      header='Add to Playlist'
      body={body}
      footer={footer} />
  )
}

function getProps (props, context) {
  return {
    ...props,
    uid: context.currentUser.uid,
    username: context.username
  }
}

const reducer = handleActions({
  [checkBoxClick.type]: (state, ref) => ({...state, selected: maybeAddToArray(ref, state.selected)})
})

export default fire((props) => ({
  myPlaylists: `/users/${props.uid}/playlists`
}))({
  initialState,
  getProps,
  reducer,
  render
})
