/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import {Block, Toast, Text} from 'vdux-ui'
import Loading from 'components/Loading'
import Transition from 'vdux-transition'
import {component, element} from 'vdux'
import Router from 'components/Router'
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

      if (state.ready && prev.props.uid !== next.props.uid) {
        return yield actions.changeUsers()
      }

      if (!state.ready && (!userProfile.loading || userProfile.error)) {
        yield actions.appDidInitialize()
      }
    },

    render ({props, context, state}) {
      const {toast, modal, userProfile} = props
      return (
        <Block tall relative>
          <Block>
            <Transition>{toast && createToast(toast)}</Transition>
            {modal && createModal(modal)}
          </Block>
          <Block tall>
            {
              state.ready && context.uid
                ? <Router {...props} userProfile={userProfile.value} {...state} />
                : <Loading />
            }
          </Block>
        </Block>
      )
    },

    reducer: {
      appDidInitialize: () => ({ready: true}),
      changeUsers: () => ({ready: false})
    }
  })
)

function createToast (message) {
  return <Toast
    fixed
    minHeight='none'
    w='200px'
    textAlign='center'
    bgColor='#333'
    color='white'
    top='8px'
    bottom='none'
    key='toast'>
    <Text>{message}</Text>
  </Toast>
}

function createModal (modal) {
  return typeof modal === 'function'
    ? modal()
    : <ModalMessage
        dismiss={modal.dismiss}
        type={modal.type}
        header={modal.header}
        animals={modal.animals}
        body={modal.body} />
}
