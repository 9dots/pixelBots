/**
 * Imports
 */

// import AddToPlaylistModal from 'components/AddToPlaylistModal'
import FlowTracker from 'components/FlowTracker'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
// import {scrollTo} from '../middleware/scroll'
import PublishPage from './PublishPage'
import OptionsPage from 'pages/OptionsPage'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block, Text} from 'vdux-ui'
// import {publish} from '../utils'
import Game from 'pages/Game'
import enroute from 'enroute'
import fire from 'vdux-fire'
import omit from '@f/omit'

const router = enroute({
  'create': (params, props) => <OptionsPage
    {...props.newGame.value}
    ref={props.new ? `/drafts/${props.draftID}` : `/games/${props.draftID}`}
    {...omit('title', props)}>
    {props.btn}
  </OptionsPage>,
  'preview': (params, props) => <Game
    initialData={props.newGame.value}
    {...props}>
    {props.btn}
  </Game>,
  'publish': (params, props) => <PublishPage publish={props.publish} draftID={props.draftID}/>
})

const nextStep = (isNew) => ({create: 'preview', preview: isNew && 'publish'})

/**
 * <Create/>
 */

export default fire((props) => ({
  newGame: props.new ? `drafts/${props.draftID}` : `games/${props.draftID}`
}))(component({
	* onCreate ({props, context}) {
		if (!props.step) {
	    const path = props.new
	      ? `/create/${props.draftID}/create`
	      : `/edit/${props.draftID}/create`
	    yield context.setUrl(path, true)
	  }
	},
  render ({props, context, actions}) {
	  const {newGame, step} = props
	  const {uid} = context
	  const path = props.new ? 'create' : 'edit'

	  if (newGame.loading || !step) {
	    return <Loading />
	  }

	  const btn = <Block my='1em' align='center center'>
	    <Button
	      fs='m'
	      p='18px'
	      fontWeight='300'
	      onClick={actions.clickNext}
	      bgColor='blue'>
	      {nextStep(props.new)[step] ? 'Save & Continue' : 'Save'}
	    </Button>
	  </Block>

	  const titleActions = <Block>
	    <FlowTracker
	      onClick={actions.clickFlowTracker}
	      active={step}
	      mr
	      steps={['create', 'preview', props.new && 'publish']} />
	  </Block>

	  return <Layout
	    navigation={[{
	      category: 'create a challenge',
	      title: step.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
	    }]}
	    bodyProps={{display: 'flex', px: '10px'}}
	    titleActions={titleActions}
	    titleImg={`/animalImages/${newGame.value.animals[0].type}.jpg`}>
	    {router(step, {newGame, ...props, btn, publish: actions.publish})}
	  </Layout>
  },
  controller: {
  	* clickNext ({props, context, actions}) {
  		const s = nextStep(props.new)[step]
  		if (s) {
	      const path = props.new ? 'create' : 'edit'
	      yield context.setUrl(`/${path}/${props.draftID}/${s}`)
	      // yield scrollTo('.action-bar-holder', '#top')
	    } else if (props.new) {
	      yield actions.publish()
	    } else {
	      yield context.setUrl('/')
	    }
  	},
  	* publish ({context, props}) {
  		yield context.firebaseTask('create_game', {
  			draftRef: props.draftID
  		})
  	},
  	* clickFlowTracker ({context, props}, selection) {
  		const path = props.new ? 'create' : 'edit'
  		yield context.setUrl(`/${path}/${props.draftID}/${selection}`)
  	}
  }
}))

