/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import ChallengeFeed from 'components/ChallengeFeed'
import maybeAddToArray from 'utils/maybeAddToArray'
import PlaylistFeed from 'components/PlaylistFeed'
import {Avatar, Block, Flex, Text} from 'vdux-ui'
import DraftFeed from 'components/DraftFeed'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
// import SelectToolbar from './SelectToolbar'
import Tabs from '../components/Tabs'
import filter from '@f/filter'
import enroute from 'enroute'
import fire from 'vdux-fire'


const router = enroute({
  'challenges': (params, props) => <ChallengeFeed
    selected={props.selected}
    thisProfileId={props.thisProfileId}
    games={props.profile.games || {}}
    mine={props.mine}
    cat={props.tab} />,
  'playlists': (params, props) => <PlaylistFeed
    playlists={props.profile.playlists || {}}
    thisProfileId={props.thisProfileId}
    mine={props.mine}
    cat={props.tab} />,
  'drafts': (params, props) => <DraftFeed
    drafts={props.profile.drafts}
    thisProfileId={props.thisProfileId}
    profileName={props.profileName}
    mine={props.mine}
    cat={props.tab} />,
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
	  const {category, subcategory, selected, profile, mine, thisProfileId} = props
	  const {username} = context

	  if (!subcategory) return <span/>

	  const selectMode = selected.length > 0
	  const {playlists} = profile

	  return (
	    <LeftNav
	      active={subcategory}
	      onClick={actions.handleClick}
	      navItems={['Playlists', 'Challenges', mine && 'Drafts']}>
	      <Block column wide>
	      	{router(props.subcategory, props)}
	      </Block>
	    </LeftNav>
	  )
  },
  controller: {
  	* handleClick ({props, context}, key) {
  		yield context.setUrl(`/${props.profile.username}/${props.category}/${key}`)
  	}
  }
})

// 

