/**
 * Imports
 */

import {Image, Modal, Block, Icon, Button} from 'vdux-ui'
import initialGameState from 'utils/initialGameState'
import {component, element} from 'vdux'
import Switch from '@f/switch'
import sleep from '@f/sleep'
import pick from '@f/pick'

const project = process.env.NODE_ENV === 'dev'
  ? 'dev'
  : '26016'

const gameKeys = Object.keys(initialGameState)

/**
 * <AdvancedResults/>
 */

export default component({
  render ({props, state, context}) {
    const {correct} = props
    return (
      <Modal w='650px' onDismiss={context.closeModal} borderRadius={10} relative p='16px 16px 8px 125px' boxShadow='rgba(0,0,0, 1) 0px 0px 140px' mt={80}>
        <Icon name='close' bgColor='black' border='2px solid white' circle='30' align='center center' absolute top right m={-15} color='white' bolder fs='20' boxShadow='0 1px 8px rgba(0,0,0,.5)' pointer onClick={context.closeModal} />
        <Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
        <Block align='center center' h={400}>
          {
            correct
              ? <Passed onComplete={props.onComplete}/>
              : <Failed />
          }
        </Block>
      </Modal>
    )
  },
})

const Passed= component({
  render({props}){
    const {onComplete} = props
    return (
      <Block wide>
        <Block textAlign='center' log={onComplete} fontFamily='"Press Start 2P"'>
          <Block color='blue'> You Passed :) </Block>
        </Block>
        <Button onClick={onComplete} text="Next"/>
      </Block>
    )
  }
})

const Failed= component({
  render(){
    return (
      <Block wide>
        <Block textAlign='center' fontFamily='"Press Start 2P"'>
          <Block color='blue'> You Failed :( </Block>
        </Block>
      </Block>
    )
  }
})