import {Image, Icon, Block, Modal, Grid, ModalHeader, ModalFooter} from 'vdux-ui'
import {component, element} from 'vdux'
import Loading from 'components/loading'
import mapValues from '@f/map-values'
import {Button, CSSContainer, wrap, Text} from 'vdux-containers'


const passwords = [
  'apple','bat','bea','butterfly','camel',
  'cupcake','dino','don','elephant','gorilla',
  'kitty','lotus','monster','narwhal','octopus',
  'penguin','pop','potato','ramen','redpanda',
  'remy','rhino','tiger','whale','yellow'
]

const images = passwords.reduce((acc, password) => {
  acc[password] = `/passwordImages/${password}.png`
  return acc
}, {})

/**
 * <Picture Password Modal/>
 */

export default component({
  render ({props, context, actions}) {
    const {value} = props
    return (
    	<Modal w={500} onDismiss={context.closeModal}>
        <ModalHeader fs='s' py='l' fontFamily='"Press Start 2P"'>
          Choose your password below:
        </ModalHeader>
        <Block>
          <Grid itemsPerRow='5'>
            {
            mapValues((picturePassword,pictureName) => <Picture picturePassword={picturePassword} pictureName={pictureName} {...props}/>, images)
            }
          </Grid>
        </Block>
        <ModalFooter>
          <Text color='black' pr={10}> Not {value.displayName}? Press Back to find your name!  </Text>
          <Button bgColor='blue' pl={5} onClick={context.closeModal} text='Back'/>
        </ModalFooter>
      </Modal>
    )
  }   
})

const Picture = wrap(CSSContainer, {
  hoverProps: {hovering: true}
})(component({
  render ({props, context, actions}) {
    const {picturePassword, pictureName, hovering, redirect, value} = props

    return (
      <Block log={console.log(value.pictureName, pictureName)} opacity={hovering ? .5 : 1} transition='all .25s' pointer 
             onClick={value.pictureName === pictureName ? [redirect.getSignInToken(value.key), context.closeModal] : [context.closeModal,context.toast(`Incorrect password, please try again`)]}>
        <Image src={picturePassword} w='100px' h='100px' display='block' p={5} />
      </Block>
    )
  }
}))




