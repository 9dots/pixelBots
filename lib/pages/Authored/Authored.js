/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import ChallengeFeed from 'components/ChallengeFeed'
import PlaylistFeed from 'components/PlaylistFeed'
import {Block} from 'vdux-ui'
import EmptyState from 'components/EmptyState'
import DraftFeed from 'components/DraftFeed'
import {component, element} from 'vdux'
import enroute from 'enroute'

const router = enroute({
  'playlists': function (params, props) {
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
  'challenges': function (params, props) {
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
  'drafts': function (params, props) {
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
  }
})

/**
 * <Authored/>
 */

export default component({
  * onCreate ({props, context}) {
    const {category, subcategory, profileName} = props

    if (!subcategory) {
      yield context.setUrl(`/${profileName}/${category}/playlists`, true)
    }
  },
  * onUpdate (prev, {props, context}) {
    const {category, subcategory, profileName} = props
    if (!subcategory) {
      yield context.setUrl(`/${profileName}/${category}/playlists`, true)
    }
  },
  render ({props, context, actions}) {
    return (
      <Block column wide tall>
        {router(props.subcategory, props)}
      </Block>
    )
  },
  controller: {
    * handleClick ({props, context}, key) {
      yield context.setUrl(`/${props.profile.username}/${props.category}/${key}`)
    }
  }
})
