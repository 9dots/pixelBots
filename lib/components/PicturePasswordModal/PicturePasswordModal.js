import { Image, Block, Modal, ModalHeader, ModalFooter } from 'vdux-ui'
import { Button, CSSContainer, wrap, Text } from 'vdux-containers'
import { component, element } from 'vdux'
import mapValues from '@f/map-values'

const passwords = [
  'apple',
  'bat',
  'bea',
  'butterfly',
  'camel',
  'cupcake',
  'dino',
  'don',
  'elephant',
  'gorilla',
  'kitty',
  'lotus',
  'monster',
  'narwhal',
  'octopus',
  'penguin',
  'pop',
  'potato',
  'ramen',
  'redpanda',
  'remy',
  'rhino',
  'tiger',
  'whale',
  'yellow'
]

const images = passwords.reduce((acc, password) => {
  acc[password] = `/passwordImages/${password}.png`
  return acc
}, {})

/**
 * <Picture Password Modal/>
 */

export default component({
  render ({ props, context, actions }) {
    const { value } = props
    return (
      <Modal w='876' onDismiss={context.closeModal}>
        <ModalHeader
          fs='s'
          pt='l'
          pb={0}
          fontFamily='&quot;Press Start 2P&quot;'>
          Choose your password below:
        </ModalHeader>
        <Block p='l' align='center center' flexWrap='wrap'>
          {mapValues(
            (picturePassword, pictureName) => (
              <Picture
                picturePassword={picturePassword}
                pictureName={pictureName}
                {...props} />
            ),
            images
          )}
        </Block>
        <ModalFooter bgColor='#666' p='12px'>
          <Block flex />
          <Text color='white' textAlign='center'>
            Not {value.displayName}? Press Back to find your name!
          </Text>
          <Block flex align='end center'>
            <Button
              bgColor='blue'
              onClick={context.closeModal}
              fs='s'
              px='l'
              py='s'>
              Back
            </Button>
          </Block>
        </ModalFooter>
      </Modal>
    )
  }
})

const Picture = wrap(CSSContainer, {
  hoverProps: { hovering: true }
})(
  component({
    render ({ props, context, actions }) {
      const { picturePassword, pictureName, hovering, value, onClick } = props

      return (
        <Block
          opacity={hovering ? 0.5 : 1}
          transition='all .25s'
          pointer
          onClick={
            value.pictureName === pictureName
              ? [onClick(value.key), context.closeModal]
              : [
                context.closeModal,
                context.toast(`Incorrect password, please try again`)
              ]
          }>
          <Image
            src={picturePassword}
            w='100px'
            h='100px'
            display='block'
            m='s' />
        </Block>
      )
    }
  })
)
