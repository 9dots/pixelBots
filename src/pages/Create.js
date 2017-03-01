/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import {updateGame, setModalMessage} from '../actions'
import FlowTracker from '../components/FlowTracker'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import {scrollTo} from '../middleware/scroll'
import Button from '../components/Button'
import OptionsPage from './OptionsPage'
import {Block, Text} from 'vdux-ui'
import element from 'vdux/element'
import {publish} from '../utils'
import enroute from 'enroute'
import fire from 'vdux-fire'
import omit from '@f/omit'
import Game from './Game'

function publishPage (draftID, uid, username) {
  return (
    <Block w='50%' m='0 auto' tall align='space-around center'>
      <Button
        bgColor='#FFF'
        hoverProps={{color: 'blue', borderColor: 'blue'}}
        color='#666'
        fs='xl'
        px='l'
        py='m'
        w='300px'
        borderColor='#CCC'
        onClick={
          () => setModalMessage(<AddToPlaylistModal
            onSubmit={() => publish(draftID)}
            cancel='Skip'
            gameID={draftID}
            uid={uid} />)
        }
        fontWeight='200'>Publish</Button>
      <Button
        bgColor='#FFF'
        hoverProps={{color: 'blue', borderColor: 'blue'}}
        color='#666'
        fs='xl'
        px='l'
        py='m'
        w='300px'
        borderColor='#CCC'
        onClick={() => setUrl(`/${username}/authored/drafts`)}
        fontWeight='200'>Save Draft</Button>
    </Block>
  )
}

const router = enroute({
  'create': (params, props) => <OptionsPage
    {...props.newGame.value}
    onEdit={updateGame(props.new ? `/drafts/${props.draftID}` : `/games/${props.draftID}`)}
    {...omit('title', props)}>
    {props.btn}
  </OptionsPage>,
  'preview': (params, props) => <Game
    initialData={props.newGame.value}
    game={props.newGame.value}
    {...omit('game', props)}>
    {props.btn}
  </Game>,
  'publish': (params, props) => publishPage(props.draftID, props.uid, props.username)
})

function * onCreate ({props}) {
  if (!props.step) {
    const path = props.new
      ? `/create/${props.draftID}/create`
      : `/edit/${props.draftID}/create`
    yield setUrl(path, true)
  }
}

function render ({props, state, local}) {
  const {newGame, step, uid} = props
  const path = props.new ? 'create' : 'edit'

  if (newGame.loading || !step) {
    return <IndeterminateProgress />
  }

  const nextStep = {
    create: 'preview',
    preview: props.new && 'publish'
  }

  const btn = <Block my='1em' align='center center'>
    <Button
      w='30%'
      fs='l'
      py='18px'
      fontWeight='300'
      onClick={clickNext}
      bgColor='blue'>{nextStep[step] ? 'Save & Continue' : 'Save'}</Button>
  </Block>

  const titleActions = <Block>
    <FlowTracker
      onClick={(selection) => setUrl(`/${path}/${props.draftID}/${selection}`)}
      active={step}
      steps={['create', 'preview', props.new && 'publish']} />
  </Block>

  return <Layout
    navigation={[{
      category: 'create a challenge',
      title: step.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
    }]}
    bodyProps={step === 'preview' && {h: 'calc(100% - 80px)'}}
    titleActions={titleActions}
    titleImg={`/animalImages/${newGame.value.animals[0].type}.jpg`}>
    {router(step, {newGame, ...props, btn})}
  </Layout>

  function * clickNext () {
    if (nextStep[step]) {
      const path = props.new ? 'create' : 'edit'
      yield setUrl(`/${path}/${props.draftID}/${nextStep[step]}`)
      yield scrollTo('.action-bar-holder', '#top')
    } else if (props.new) {
      yield publish()
    } else {
      yield setUrl('/')
    }
  }
}

function getProps (props, context) {
  return {
    ...props,
    uid: context.uid,
    username: context.username
  }
}

export default fire((props) => ({
  newGame: props.new ? `drafts/${props.draftID}` : `games/${props.draftID}`
}))({
  onCreate,
  getProps,
  render
})
