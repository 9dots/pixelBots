/**
 * Imports
 */

import Loading from 'components/Loading'
import Transition from 'vdux-transition'
import {component, element} from 'vdux'
import Router from 'components/Router'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <App/>
 */

export default fire((props) => ({
  userProfile: `/users/${props.uid}`
}))(
  component({
    initialState: {
      ready: false
    },

    * onUpdate (prev, next) {
      const {props, actions, state} = next
      const {userProfile = {}} = props

      if (!state.ready && (!userProfile.loading || userProfile.error)) {
        yield actions.appDidInitialize()
      }
    },

    render ({props, context, state}) {
      console.log(props)
      const {toast, modal, userProfile} = props

      return (
        <Block>
          <Block>
            <Transition>{toast}</Transition>
            {modal && modal()}
          </Block>
          <Block>
            {
              state.ready
                ? <Router {...props} userProfile={userProfile.value} {...state} />
                : <Loading />
            }
          </Block>
        </Block>
      )
    },

    reducer: {
      appDidInitialize: () => ({ready: true})
    }
  })
)
