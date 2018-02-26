/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import { Block, Icon, Toast, Text } from 'vdux-ui'
import BotModal from 'components/BotModal'
import { component, element } from 'vdux'
import Loading from 'components/Loading'
import Transition from 'vdux-transition'
import Router from 'components/Router'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <App/>
 */

export default fire(props => ({
  userProfile: {
    ref: `/users/${props.uid}#bindAs=object`
  },
  versionNumber: `/versionNumber`
}))(
  component({
    initialState: {
      ready: false
    },

    render ({ props, context, state }) {
      const { toast, modal, userProfile, connected = true } = props
      const userProfileValue = userProfile.value || undefined
      return (
        <Block tall relative>
          <Block>
            <Transition>{toast && createToast(toast)}</Transition>
            {modal && createModal(modal)}
          </Block>
          <Block tall>
            {state.ready && context.uid ? (
              <Router
                {...omit(['modal', 'toast'], props)}
                userProfile={userProfileValue}
                {...state} />
            ) : (
              <Loading />
            )}
            {!connected &&
              process.env.NODE_ENV !== 'dev' && (
                <Transition>
                  <Toast
                    key='a'
                    bg='red'
                    color='white'
                    align='center center'
                    w={600}>
                    <Block align='center center'>
                      <Icon name='error' fs='m' mr='s' />
                      <Text fw='bolder' mr='s'>
                        Oops!
                      </Text>
                      <Text fw='lighter'>Reconnecting...</Text>
                    </Block>
                  </Toast>
                </Transition>
              )}
          </Block>
        </Block>
      )
    },

    * onUpdate (prev, next) {
      const { props, actions, state } = next
      const { userProfile = {}, versionNumber = {} } = props

      console.log(process.env.NODE_ENV)
      if (process.env.NODE_ENV === 'production') {
        if (
          prev.props.versionNumber.value !== versionNumber.value &&
          versionNumber.value !==
            document.getElementsByTagName('meta').version.content
        ) {
          yield actions.openRefreshModal()
        }
      }

      if (state.ready && prev.props.uid !== next.props.uid) {
        return yield actions.changeUsers()
      }

      if (!state.ready && (!userProfile.loading || userProfile.error)) {
        yield actions.appDidInitialize()
      }
    },

    controller: {
      * openRefreshModal ({ context, actions }) {
        yield context.openModal(() => (
          <BotModal
            title='Uh Oh'
            canClose={false}
            body={
              <Block textAlign='center'>
                Your PixelBots is out of date. Please refresh the page to
                continue.
              </Block>
            }
            confirm={actions.refresh}
            confirmText='Reload' />
        ))
      },
      refresh () {
        window.location.reload()
      }
    },

    reducer: {
      appDidInitialize: () => ({ ready: true }),
      changeUsers: () => ({ ready: false })
    }
  })
)

function createToast (message) {
  return (
    <Toast
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
  )
}

function createModal (modal) {
  return typeof modal === 'function' ? (
    modal()
  ) : (
    <ModalMessage
      dismiss={modal.dismiss}
      type={modal.type}
      header={modal.header}
      animals={modal.animals}
      body={modal.body} />
  )
}
