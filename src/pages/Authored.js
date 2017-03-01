/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import ShowcaseView from './PlaylistFeed'
import {Avatar, Block, Flex, Text} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/LeftNav'
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

const router = enroute({
  'challenges': (params, props) => <ChallengeFeed
    selected={props.selected}
    toggleSelected={props.actions.toggleSelected}
    uid={props.userKey}
    games={props.profile.games || {}}
    mine={props.mine}
    cat={props.tab} />,
  'playlists': (params, props) => <PlaylistFeed
    playlists={props.profile.playlists || {}}
    uid={props.userKey}
    mine={props.mine}
    cat={props.tab} />,
  'drafts': (params, props) => <DraftsFeed
    drafts={props.profile.drafts}
    uid={props.userKey}
    mine={props.mine}
    cat={props.tab} />,
  'assignments': (params, props) => <AssignmentFeed
    mine={props.mine}
    uid={props.userKey}
    cat={props.tab} />
})

function onCreate ({props}) {
  const {category, params, username} = props
  if (!props.category) {
    return setUrl(`/${username}/${params}/playlists`, true)
  }
}

function render ({props, state, local}) {
  const {mine, thisProfile, uid, myProfile, username, category, selected} = props
  const selectMode = selected.length > 0

  const profile = mine ? myProfile : thisProfile.value

  if (!profile || !uid || !category) return <IndeterminateProgress />

  const {playlists} = profile

  return (
    <Layout
      active={category}
      onClick={(key) => setUrl(`/${username}/${props.params}/${key}`)}
      navItems={['Playlists', 'Challenges', mine && 'Drafts']}>
      <Block column wide>
        {router(props.category, {...props, ...state, profile})}
      </Block>
    </Layout>
  )
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
  onCreate,
  getProps,
  render
})
