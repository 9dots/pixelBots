/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import PlaylistSearchFeed from './PlaylistSearchFeed'
import ProfileTab from '../components/ProfileTab'
import {setUrl} from 'redux-effects-location'
import handleActions from '@f/handle-actions'
import ChallengeFeed from './ChallengeFeed'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import {Block, Flex} from 'vdux-ui'
import element from 'vdux/element'
import reduce from '@f/reduce'
import filter from '@f/filter'
import enroute from 'enroute'
import fire from 'vdux-fire'

const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')

const initialState = ({local}) => ({
  selected: [],
  actions: {
    toggleSelected: local((key) => toggleSelected(key)),
    clearSelected: local(() => clearSelected())
  }
})

function * onUpdate (prev, {props, state}) {
  if (prev.props.searchKey !== props.searchKey) {
    yield state.actions.clearSelected()
  }
}

const router = enroute({
  'games': (params, {items, actions, selected}) => (
    <ChallengeFeed editable games={items} toggleSelected={actions.toggleSelected} selected={selected} />
	),
  'playlists': (params, {items}) => (
    <PlaylistSearchFeed playlists={items} />
	)
})

const reduceType = (cur, next) => {
  return {
    ...cur,
    [next._type]: {
      ...cur[next._type],
      [next._id]: {
        ...next._source.body,
        ref: next._id
      }
    }
  }
}

function render ({props, state}) {
  const {responses, tab, playlists, uid, searchQ = ''} = props
  const {actions, selected} = state
  const hits = responses.value
		? responses.value.hits
		: {}

  const byType = reduce(reduceType, {games: {}, playlists: {}, users: {}}, hits)

  const toolbar = <SelectToolbar
    selected={selected}
    playlists={filter((playlist) => playlist.creatorID === uid, playlists)}
    uid={props.userKey}
    clearSelected={actions.clearSelected}
    num={selected.length} />

  const tabs = <Flex mx='20px' borderBottom='1px solid #999' wide relative bottom='0' color='lightBlue' h='42px'>
    <ProfileTab
      title={`${Object.keys(byType.games).length || 0} challenges`}
      underlineColor='red'
      active={tab === 'games'}
      handleClick={() => setUrl(`/search/games/${searchQ}`)} />
    <ProfileTab
      title={`${Object.keys(byType.playlists).length || 0} playlists`}
      underlineColor='lightBlue'
      active={tab === 'playlists'}
      handleClick={() => setUrl(`/search/playlists/${searchQ}`)} />
  </Flex>

  return (
    <Block>
      {selected.length > 0
				? toolbar
				: tabs}
      {responses.loading && props.searchKey
				? <IndeterminateProgress />
				: router(tab, {items: byType[tab], actions, selected})}
    </Block>
  )
}

const reducer = handleActions({
  [toggleSelected]: (state, payload) => ({
    ...state,
    selected: maybeAddToArray(payload, state.selected)
  }),
  [clearSelected]: (state) => ({...state, selected: []})
})

function maybeAddToArray (val, arr) {
  if (arr.indexOf(val) > -1) {
    return arr.filter((item) => item !== val)
  } else {
    return arr.concat(val)
  }
}

function getProps (props, {profile}) {
  return {
    ...props,
    playlists: profile && profile.playlists
  }
}

export default fire((props) => ({
  responses: `/search/response/${props.searchKey}`
}))({
  initialState,
  getProps,
  onUpdate,
  reducer,
  render
})
