/**
 * Imports
 */

import initialGameState from 'utils/initialGameState'
import {Image, Modal, Block, Icon} from 'vdux-ui'
import {Button, Text} from 'vdux-containers'
import {component, element} from 'vdux'
import Switch from '@f/switch'
import sleep from '@f/sleep'
import pick from '@f/pick'

const project = process.env.NODE_ENV === 'dev'
  ? 'dev'
  : '26016'

const gameKeys = Object.keys(initialGameState)

const gameOverBtnProps = (color = 'blue') => ({
  textTransform: 'uppercase',
  bgColor: color,
  w: '120px',
  p: 's',
  fs: 's'
})

/**
 * <CheckingModal/>
 */

export default component({
  render ({props, state, context}) {
    const {correct} = props
    console.log(props)

    return (
      <Modal w='650px' onDismiss={context.closeModal} borderRadius={10} relative p='16px 16px 8px 125px' boxShadow='rgba(0,0,0, 1) 0px 0px 140px' mt={80}>
        <Icon name='close' bgColor='black' border='2px solid white' circle='30' align='center center' absolute top right m={-15} color='white' bolder fs='20' boxShadow='0 1px 8px rgba(0,0,0,.5)' pointer onClick={context.closeModal} />
        <Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
        <Block align='center center' h={220}>
          {
            correct
              ? <Passed onComplete={props.onComplete}/>
              : <Failed next={props.next} />
          }
        </Block>
      </Modal>
    )
  },
})

const Passed= component({
  render({props, context}){
    const {onComplete} = props

    return (
      <Block wide tall column align='space-around center' py>
        <Block textAlign='center' fontFamily='"Press Start 2P"'>
          <Block color='blue'>Congratulations!</Block>
        </Block>
        <Block textAlign='center' p>
          You solved the challenge.  Click submit to move on or click revise to continue working on your code!
        </Block>
        <Block>
          <Button {...gameOverBtnProps('green')} mr onClick={context.closeModal} text='Retry'/>
          <Button {...gameOverBtnProps()} ml onClick={onComplete} text='Submit'/>
        </Block>
      </Block>
    )
  }
})

const Failed= component({
  render({props, context}){
    return (
      <Block wide tall column align='space-around center' py>
        <Block textAlign='center' fontFamily='"Press Start 2P"'>
          <Block color='red'>Uh Oh!</Block>
        </Block>
        <Block textAlign='center' p w='75%'>
          Your code didn't solve this challenge quite yet. Keep on trying until you get it!
        </Block>
        <Button {...gameOverBtnProps('#666')} my='s' onClick={context.closeModal} text='Try Again'/>

        <Text textDecoration='underline' pointer fs='xxs' opacity={.6} hoverProps={{opacity: .8}} onClick={props.next}>Skip Challenge Anyway</Text>
      </Block>
    )
  }
})