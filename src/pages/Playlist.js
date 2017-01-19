import omit from '@f/omit'
import GameLoader from './GameLoader'
import element from 'vdux/element'
import fire from 'vdux-fire'
import Button from '../components/Button'
import {Block, Icon, Text} from 'vdux-ui'
import Layout from '../layouts/HeaderAndBody'

function render ({props}) {
  const isNext = props.current + 1 < props.sequence.length
  const isPrev = props.current - 1 >= 0

  const titleActions = (
    <Block>
      <Text fs='m' mr='2em'>{props.current + 1} / {props.sequence.length}</Text>
      {
        isNext
          ? <Button bgColor='blue' w='160px' onClick={props.next}>NEXT</Button>
          : <Block w='160px' />
      }
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

  return (
    <Layout
      category='playlist'
      title={props.name}
      leftAction={leftAction}
      titleImg={props.imageUrl}
      titleActions={titleActions}>
      <GameLoader playlist gameCode={props.sequence[props.current]} saveID={props.saveIds[props.current]} {...omit('saveID', props)} />
    </Layout>
  )
}

export default {
  render
}
