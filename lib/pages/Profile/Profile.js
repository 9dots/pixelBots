/**
 * Imports
 */

import maybeAddToArray from 'utils/maybeAddToArray'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
import Authored from 'pages/Authored'
import Gallery from 'pages/Gallery'
import Studio from 'pages/Studio'
import enroute from 'enroute'
import {Block} from 'vdux-ui'
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
