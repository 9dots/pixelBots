/**
 * Imports
 */

import PreviewCanvas from 'components/PreviewCanvas'
import { component, element } from 'vdux'
import Loading from 'components/Loading'
import { Block, Text, Button, Icon } from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <Course Page/>
 */

export default fire(props => ({
  saved: {
    ref: `/saved/${props.saveRef}`,
    join: [
      {
        ref: '/games',
        child: 'gameRef'
      },
      {
        ref: '/users',
        child: 'uid'
      }
    ]
  }
}))(
  component({
    render ({ props, context }) {
      const { saved, isModal } = props
      const { value, loading } = saved

      if (loading) return <Loading />

      const { animals, gameRef, speed = 10, uid } = value
      const newState = {
        ...gameRef,
        speed,
        animals
      }
      const { displayName, username } = uid

      return (
        <Block wide mx='auto' display='flex' flexWrap='wrap'>
          <Block
            flex
            px='xl'
            align='center center'
            bgColor='white'
            h={isModal ? 'auto' : '100vh'}>
            <PreviewCanvas w='100%' {...newState} />
          </Block>
          <Block p='xl' bg='#f9f9f9' column flex display='flex'>
            <Block tall flex='4 1 0%' textAlign='left' align='start end'>
              <Block flex>
                <Text>{displayName}</Text>
                <br />
                <Text fontFamily='&quot;Press Start 2P&quot;' fs='xl' my='l'>
                  {newState.title}
                </Text>
                <br />
                <Text>{newState.description}</Text>
              </Block>
            </Block>
            {isModal ? (
              <Block flex='1 0 0%' align='start end'>
                <Button mr='0.5em' fs='s' h={38} onClick={props.closeModal()}>
                  <Icon name='close' fs='s' mr='xs' />
                  CLOSE PREVIEW
                </Button>
              </Block>
            ) : (
              <Block flex='1 0 0%' align='start end'>
                <Button mr='0.5em' fs='s' h={38} onClick={context.setUrl('/')}>
                  <Icon name='home' fs='s' mr='xs' />
                  HOME
                </Button>
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
    }
  })
)
