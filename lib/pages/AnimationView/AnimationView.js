/**
 * Imports
 */

import PreviewCanvas from 'components/PreviewCanvas'
import { Block, Text, Button, Icon } from 'vdux-ui'
import { svgAsPngUri } from 'save-svg-as-png'
import { component, element } from 'vdux'
import Loading from 'components/Loading'
import createAction from '@f/create-action'
import fire from 'vdux-fire'

/**
 * <Animation View/>
 */

export default fire(props => ({
  sandbox: {
    ref: `/sandbox/${props.sandboxRef}`,
    join: [
      {
        ref: '/saved',
        child: 'saveRef'
      },
      {
        ref: '/users',
        child: 'creatorID'
      }
    ]
  }
}))(
  component({
    render ({ props, context, actions }) {
      const { sandbox, isModal, isSubmit } = props
      const { value, loading } = sandbox

      if (loading) return <Loading />

      const { saveRef, creatorID } = value
      const { displayName, username } = creatorID

      return (
        <Block wide mx='auto' display='flex' flexWrap='wrap'>
          <Block
            flex
            px='xl'
            align='center center'
            bgColor='white'
            h={isModal ? 'auto' : '100vh'}>
            <PreviewCanvas w='100%' {...saveRef} />
          </Block>
          <Block p='xl' bg='#f9f9f9' column flex display='flex'>
            {isModal && (
              <Block flex textAlign='right'>
                <Button
                  fs='80'
                  mt='-20px'
                  mr='-20px'
                  color='#999'
                  onClick={props.closeModal()}
                  icon='close' />
              </Block>
            )}
            <Block tall flex='4 1 0%' textAlign='left' align='start end'>
              <Block flex>
                <Text>{displayName}</Text>
                <br />
                <Text fontFamily='&quot;Press Start 2P&quot;' fs='xl' my='l'>
                  {value.title}
                </Text>
                <br />
                <Text>{value.description}</Text>
              </Block>
            </Block>
            {isSubmit && (
              <Block flex='1 0 0%' align='start end'>
                <Button
                  mr='0.5em'
                  fs='s'
                  h={38}
                  bgColor='blue'
                  onClick={[
                    actions.saveFrameAsPNG(),
                    context.setUrl(`/${context.username}/gallery`),
                    context.firebaseSet(
                      `/sandbox/${props.sandboxRef}/isDraft`,
                      true
                    ),
                    context.toast(`Saved ${value.title} to drafts`)
                  ]}>
                  <Icon name='receipt' fs='m' mr='xs' />
                  SAVE AS DRAFT
                </Button>
                <Button
                  mr='0.5em'
                  fs='s'
                  h={38}
                  bgColor='green'
                  onClick={[
                    actions.saveFrameAsPNG(),
                    context.setUrl(`/${context.username}/gallery`),
                    context.firebaseSet(
                      `/sandbox/${props.sandboxRef}/isDraft`,
                      false
                    ),
                    context.toast(`Published ${value.title}!`)
                  ]}>
                  <Icon name='public' fs='m' mr='xs' />
                  {'SAVE & PUBLISH'}
                </Button>
              </Block>
            )}
            {!isModal && (
              <Block flex='1 0 0%' align='start end'>
                <Button
                  mr='0.5em'
                  fs='s'
                  h={38}
                  onClick={context.setUrl(`/${username}/gallery`)}>
                  <Icon name='face' fs='s' mr='xs' />
                  {`MORE BY ${displayName.toUpperCase()}`}
                </Button>
              </Block>
            )}
          </Block>
        </Block>
      )
    },

    middleware: [uploadMw],

    controller: {
      * saveFrameAsPNG ({ middleware, props, context, actions }) {
        svgAsPngUri(document.getElementById('preview-svg1'), {}, function (uri) {
          return middleware(upload(uri))
        })
      },
      * uploadFrame ({ props, context, actions }, uri) {
        const { value } = yield context.fetch(
          `${process.env.CLOUD_FUNCTIONS}/uploadAnimationThumb`,
          {
            method: 'POST',
            body: {
              uri: uri,
              ref: props.sandboxRef
            }
          }
        )
        return value.status
      }
    }
  })
)

/**
 * Middleware
 */

const upload = createAction('<AnimationView/>: UPLOAD')

function uploadMw ({ dispatch, actions, getState }) {
  return next => action => {
    if (action.type === upload.type) {
      dispatch(actions.uploadFrame(action.payload))
    }
    return next(action)
  }
}
