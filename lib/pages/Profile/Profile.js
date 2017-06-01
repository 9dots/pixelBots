/**
 * Imports
 */

import ChallengeFeed from 'components/ChallengeFeed'
import maybeAddToArray from 'utils/maybeAddToArray'
import PlaylistFeed from 'components/PlaylistFeed'
import EmptyState from 'components/EmptyState'
import DraftFeed from 'components/DraftFeed'
import Redirect from 'components/Redirect'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
import Gallery from 'pages/Gallery'
import enroute from 'enroute'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <Profile/>
 */

// const router = enroute({
//   authored: (params, props) => <Authored {...props} />,
//   gallery: (params, props) => <Gallery {...props} />
// })

const router = enroute({
  gallery: (params, props) => <Gallery {...props} />,
  playlists: function(params, props) { 
    const items = props.profile.playlists
    return (
      items && Object.keys(items).length
        ? <Block ml='-1'><PlaylistFeed
            playlists={items}
            thisProfileId={props.thisProfileId}
            mine={props.mine}
            cat={props.tab} /></Block>
        : <EmptyState icon='view_list' title='Your Playlists' description='All the playlists you create will appear here. Click the Create button in the sidebar to get started making your first playlist!' />
    )
  },
  stats: function (params, props) {
    return (
      <Block>
        Check out them stats
      </Block>
    )
  },
  challenges: function (params, props) { 
    const items = props.profile.games
    return (
      items && Object.keys(items).length
        ? <ChallengeFeed
            selected={props.selected}
            thisProfileId={props.thisProfileId}
            games={items}
            mine={props.mine}
            cat={props.tab} />
        : <EmptyState icon='stars' title='Your Challenges' description='All the challenges you create will appear here. Click the Create button in the sidebar to get started making your first challenge!' />
    )
  },
  drafts: function(params, props)
    { 
      const items = props.profile.drafts
      return (
        items && Object.keys(items).length
          ? <DraftFeed
              drafts={items}
              thisProfileId={props.thisProfileId}
              profileName={props.profileName}
              mine={props.mine}
              cat={props.tab} />
          : <EmptyState icon='edit' title='Your Drafts' description='All the playlists you create will appear here. Click the Create button in the sidebar to get started making your first playlist!' />
    )
  },
  '*': function(params, props) {
    return (<Redirect to={`/${props.profileName}/gallery`} />)
  } 
})

const Profile = fire((props) => ({
  thisProfile: `/users/${props.thisProfileId}`
}))(component({
  initialState: {
    selected: []
  },
  * onCreate ({props, context}) {
    if (!props.thisProfileId) {
      yield context.setUrl('/404')
    }
  },
  render ({props, context, actions, state}) {
    const {mine, thisProfile, userProfile} = props

    if (thisProfile.loading) return <Loading />

    const profile = mine ? userProfile : thisProfile.value

    return (
      <Block flex column wide tall>
        <Block borderTop='1px solid #E0E0E0' wide tall>
          <LeftNav isMine={mine} thisProfile={thisProfile}>
            <Block id='profile-container' column wide tall p='l' overflowY='auto'>
              {router(props.category, {...props, ...state, profile})}
            </Block>
          </LeftNav>
        </Block>
      </Block>
    )
  },
  controller: {
    * handleClick ({props, actions, context}, tab) {
      if (props.params !== tab) {
        yield context.setUrl(`/${props.profileName}/${tab}`)
      }
    }
  },
  reducer: {
    toggleSelected: (state, key) => ({selected: maybeAddToArray(key, state.selected)}),
    clearSelected: (state) => ({selected: []})
  }
}))

/**
 * <Loader/>
 */

export default fire((props) => ({
  thisProfileId: `/usernames/${props.profileName}`
}))(component({
  render ({props, context}) {
    const {thisProfileId} = props
    const {value, loading} = thisProfileId
    const {uid} = context

    if (loading) return <Loading />

    return <Profile
      {...omit('thisProfileId', props)}
      mine={uid === value}
      thisProfileId={value} />
  }
}))
