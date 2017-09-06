/**
 * Imports
 */

import {Image, Modal, Block, Icon} from 'vdux-ui'
import {Text, Button} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <BotModal/>
 */

const gameOverBtnProps = (color = 'blue') => ({
  textTransform: 'uppercase',
  bgColor: color,
  w: '120px',
  fs: 's',
  p: 's',
  mx: 's'
})

export default component({
  render ({props, context, actions}) {
  	const {title = 'Instructions', body = '', rejectText = 'Cancel', confirmText = 'Confirm', reject, confirm, altText = 'Close', alt} = props
    
    return (
      <Modal w='600px' onDismiss={actions.closeModal} borderRadius={10} relative p='16px 24px 8px 160px' boxShadow='rgba(0,0,0, 1) 0px 0px 140px' mt={80}>
        <Icon name='close' bgColor='black' border='2px solid white' circle='30' align='center center' absolute top right m={-15} color='white' bolder fs='20' boxShadow='0 1px 8px rgba(0,0,0,.5)' pointer onClick={actions.closeModal} />
        <Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
        <Block fontFamily='"Press Start 2P"' color='blue' textAlign='center' pt='l'>
        	{title}
        </Block>
        <Block minHeight={100} pt='l'>
          {body}
        </Block>
        <Block align='center center' pb='l'>
          <Block align='start center' py>
            {
              alt &&
                <Button onClick={alt} {...gameOverBtnProps('grey')}>
                  {altText}
                </Button>
            }
            {
              confirm &&
                <Button onClick={confirm} {...gameOverBtnProps()}>
                  {confirmText}
                </Button>
            }
          </Block>
          {
            reject &&
              <Text textDecoration='underline' pointer fs='xxs' opacity={.6} hoverProps={{opacity: .8}} onClick={reject}>
                {rejectText}
              </Text>
          }
        </Block>
      </Modal>
    )
  },
  controller: {
    * closeModal ({props, context}) {
      if (props.onDismiss) {
        yield props.onDismiss()
      }
      yield context.closeModal()
    }
  }
})
