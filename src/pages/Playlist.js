/** @jsx element */

import omit from '@f/omit'
import GameLoader from './GameLoader'
import element from 'vdux/element'
import Button from '../components/Button'
import {Block, Icon, Text} from 'vdux-ui'

function render ({props}) {
  const isNext = props.current + 1 < props.sequence.length
  const isPrev = props.current - 1 >= 0

  const titleActions = (
    <Block>
      <Text fs='m'>{props.current + 1} / {props.sequence.length}</Text>
      <Button
        ml='2em'
        mr='0.5em'
        bgColor={isPrev ? 'blue' : 'disabled'}
        disabled={!isPrev}
        onClick={props.prev}>BACK</Button>
      <Button
        bgColor={isNext ? 'blue' : 'disabled'}
        disabled={!isNext}
        onClick={props.next}>NEXT</Button>
    </Block>
  )

  const leftAction = isPrev &&
    <Button
      px='0'
      w='40px'
      align='center center'
      borderWidth='0'
      bgColor='transparent'
      hoverProps={{bgColor: '#ccc'}}
      mr='1em'
      color='#333'
      onClick={props.prev}>
      <Icon name='arrow_back' />
    </Button>

  return <GameLoader
    playlist={{
      leftAction,
      title: props.name,
      img: props.imageUrl,
      actions: titleActions
    }}
    gameCode={props.sequence[props.current]}
    saveID={props.saveIds[props.current]}
    {...omit('saveID', props)} />
}

export default {
  render
}
