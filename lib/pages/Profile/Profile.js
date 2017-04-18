/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import maybeAddToArray from 'utils/maybeAddToArray'
import {Avatar, Block, Flex, Text} from 'vdux-ui'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
import Authored from 'pages/Authored'
import Gallery from 'pages/Gallery'
import Tabs from 'components/Tabs'
import Studio from 'pages/Studio'
import filter from '@f/filter'
import enroute from 'enroute'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <Profile/>
 */

const router = enroute({
  authored: (params, props) => <Authored {...props} />,
  studio: (params, props) => <Studio {...props} />,
  gallery: (params, props) => <Gallery {...props} />
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
	  const {uid, username} = context
	  const {selected} = state

	  if (thisProfile.loading) return <Loading />

	  const profile = mine ? userProfile : thisProfile.value
  	const selectMode = selected.length > 0

	  const {playlists} = profile
    console.log('test')
	  return (
		  <Layout
		    navigation={[{category: 'user', title: profile.displayName}]}
		    bodyProps={{py: 0, display: 'flex'}}
		    titleImg={profile.photoURL}
        imgRounded>
        <Block borderTop='1px solid #E0E0E0' wide>
          <LeftNav isMine={mine} thisProfile={thisProfile}>
            <Block column wide tall p='l' overflowY='auto'>
    	        {router(props.category, {...props, ...state, profile})}
    		    </Block>
          </LeftNav>
        </Block>
		  </Layout>
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

