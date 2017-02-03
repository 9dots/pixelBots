/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import FlowTracker from '../components/FlowTracker'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import {scrollTo} from '../middleware/scroll'
import Button from '../components/Button'
import OptionsPage from './OptionsPage'
import {updateGame} from '../actions'
import element from 'vdux/element'
import {publish} from '../utils'
import enroute from 'enroute'
import {Block, Text} from 'vdux-ui'
import fire from 'vdux-fire'
import Game from './Game'

function publishPage (draftID) {
  return (
    <Block column wide tall align='center center'>
      <Button
        bgColor='green'
        fs='xxl'
        px='xl'
        py='m'
        onClick={[() => setUrl('/'), () => publish(draftID)]}
        fontWeight='200'>Publish</Button>
      <Text display='block' fs='l' fontWeight='300' my='1em'>or</Text>
      <Button
        bgColor='blue'
        fs='l'
        px='l'
        py='s'
        onClick={() => setUrl('/')}
        fontWeight='300'>Save as Draft</Button>
    </Block>
  )
}

const router = enroute({
  'create': (params, props) => <OptionsPage
    {...props.newGame.value}
    onEdit={updateGame(props.new ? `/drafts/${props.draftID}` : `/games/${props.draftID}`)}
    {...props}/>,
  'preview': (params, props) => <Game
    initialData={props.newGame.value}
    gameData={props.newGame.value}
    {...props}/>,
  'publish': (params, props) => publishPage(props.draftID)
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
  const {newGame, step} = props
  const path = props.new ? 'create' : 'edit'

  if (newGame.loading || !step) {
    return <IndeterminateProgress/>
  }

  const nextStep = {
    create: 'preview',
    preview: props.new && 'publish'
  }

  const titleActions = <Block>
    <FlowTracker
      onClick={(selection) => setUrl(`/${path}/${props.draftID}/${selection}`)}
      active={step}
      steps={['create', 'preview', props.new && 'publish']}/>
  </Block>

  return <Layout
    navigation={[{
      category: 'create a challenge',
      title: step.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
    }]}
    titleActions={titleActions}
    titleImg='/animalImages/panda.jpg'>
    {router(step, {newGame, ...props})}
    {
      step !== 'publish' && <Block my='1em' align='center center'>
        <Button
          w='30%'
          fs='l'
          py='18px'
          fontWeight='300'
          onClick={clickNext}
          bgColor='blue'>{nextStep[step] ? 'Save & Continue' : 'Save'}</Button>
      </Block>
    }
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

export default fire((props) => ({
  newGame: props.new ? `drafts/${props.draftID}` : `games/${props.draftID}`
}))({
  onCreate,
  render
})
