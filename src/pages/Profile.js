/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import {Avatar, Block, Flex, Text} from 'vdux-ui'
import AssignmentFeed from './AssignmentFeed'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import DraftsFeed from './DraftsFeed'
import ChallengeFeed from './ChallengeFeed'
import SelectToolbar from './SelectToolbar'
import createAction from '@f/create-action'
import PlaylistFeed from './PlaylistFeed'
import {maybeAddToArray} from '../utils'
import Tabs from '../components/Tabs'
import element from 'vdux/element'
import filter from '@f/filter'
import enroute from 'enroute'
import fire from 'vdux-fire'

const toggleSelected = createAction('PROFILE: TOGGLE_SELECTED')
const clearSelected = createAction('PROFILE: CLEAR_SELECTED')
const toggleSelectMode = createAction('PROFLIE: TOGGLE_SELECT_MODE')

const initialState = ({local}) => ({
  selected: [],
  actions: {
    toggleSelected: local((key) => toggleSelected(key)),
    clearSelected: local(() => clearSelected()),
    toggleSelectMode: local(() => toggleSelectMode())
  }
})

const router = enroute({
  'challenges': (params, props) => <ChallengeFeed
    selected={props.selected}
    toggleSelected={props.actions.toggleSelected}
    uid={props.userKey}
    games={props.profile.games}
    mine={props.mine}
    cat={props.tab} />,
  'playlists': (params, props) => <PlaylistFeed
    playlists={props.profile.playlists}
    uid={props.userKey}
    mine={props.mine}
    cat={props.tab} />,
  'drafts': (params, props) => <DraftsFeed
    drafts={props.profile.drafts}
    uid={props.userKey}
    mine={props.mine}
    cat={props.tab}/>,
  'assignments': (params, props) => <AssignmentFeed
    mine={props.mine}
    uid={props.userKey}
    cat={props.tab} />
})

function render ({props, state, local}) {
  const {mine, thisProfile, currentUser, myProfile, username} = props
  const {actions, selected} = state
  const selectMode = selected.length > 0

  const profile = mine ? myProfile : thisProfile.value

  if (!profile || !currentUser) return <IndeterminateProgress />

  const {playlists} = profile

  return (
    <Layout
      navigation={[{category: 'userss', title: profile.displayName}]}
      bodyProps={{py: 0, display: 'flex'}}
      titleImg={profile.photoURL}>
      <Block column wide h='calc(100% - 1px)'>
        <Block mt='10px' px='20px'>
          {
            !selectMode
              ? <Tabs
                tabs={['playlists', 'challenges', mine && 'drafts']}
                active={props.params}
                onClick={(tab) => setUrl(`/${username}/${tab}`)}/>
              : <SelectToolbar
                selected={selected}
                playlists={filter((playlist) => playlist.creatorID === currentUser.uid, playlists)}
                uid={props.userKey}
                mine={mine}
                clearSelected={actions.clearSelected}
                num={selected.length} />
          }
        </Block>
        {router(props.params, {...props, ...state, profile})}
      </Block>
    </Layout>
  )
}

function reducer (state, action) {
  switch (action.type) {
    case toggleSelected.type:
      return {
        ...state,
        selected: maybeAddToArray(action.payload, state.selected)
      }
    case clearSelected.type:
      return {
        ...state,
        selected: []
      }
  }
  return state
}

function getProps (props, context) {
  return {
    ...props,
    myProfile: context.profile
  }
}

export default fire((props) => ({
  thisProfile: `/users/${props.userKey}`
}))({
  initialState,
  getProps,
  reducer,
  render
})
