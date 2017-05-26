/**
 * Imports
 */

import GameTypeOptions from 'components/GameTypeOptions'
import FlowTracker from 'components/FlowTracker'
import createCode from 'utils/createShortCode'
import GameLoader from 'components/GameLoader'
import animalApi, {images} from 'animalApis'
import OptionsPage from 'pages/OptionsPage'
import CreateLayout from './CreateLayout'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import PublishPage from './PublishPage'
import {component, element} from 'vdux'
import Button from 'components/Button'
import {Block, Icon} from 'vdux-ui'
import validate from './validate'
import enroute from 'enroute'
import fire from 'vdux-fire'
import omit from '@f/omit'
import pick from '@f/pick'

const router = enroute({
  options: (params, props) => <CreateLayout {...props} {...props.newGame.value} step='options'>
    <OptionsPage
      {...props.newGame.value}
      {...omit('title', props)}>
      {props.btn}
    </OptionsPage>
  </CreateLayout>,
  create: (params, props) => <GameTypeOptions
  	{...props.newGame.value}
    draftGame={props.newGame.value}
    {...props} />,
  preview: (params, props) => <CreateLayout {...props} {...props.newGame.value} step='preview' validate=''>
    <GameLoader
      initialData={props.newGame.value}
      {...props} />
  </CreateLayout>,
  solution: (params, props) => <CreateLayout {...props} {...props.newGame.value} step='solution'>
    <GameLoader
      initialData={props.newGame.value}
      {...props} />
  </CreateLayout>,
  publish: (params, props) => <PublishPage data={props.newGame.value} publish={props.publish} draftID={props.draftID}/>
})

const nextStep = (isNew, advanced = false) => ({
	options: 'create',
	create: advanced ? 'solution' : 'preview',
	preview: isNew && 'publish',
  solution: isNew && 'publish'
})

/**
 * <Create/>
 */

export default fire((props) => ({
  newGame: props.new ? `drafts/${props.draftID}` : `games/${props.draftID}`
}))(component({
	* onCreate ({props, context}) {
		if (!props.step) {
	    const path = props.new
	      ? `/create/${props.draftID}/options`
	      : `/edit/${props.draftID}/options`
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

	  const btn = (
      <Block my='1em' align='center center'>
  	    <Button
  	      fs='m'
  	      p='18px'
  	      fontWeight='300'
  	      onClick={actions.clickNext}
  	      bgColor='blue'>
  	      {
            nextStep(props.new, newGame.value.advanced)[step]
              ? 'Save & Continue'
              : 'Save'
          }
  	    </Button>
  	  </Block>
    )

    const hasNext = nextStep(props.new, newGame.value.advanced)[step]

    const type = newGame.value && newGame.value.animals[0].type
    const img = type ? images[type] : ''

	  return router(step, {newGame, ...props, btn, ...actions, img, validate})
  },

  * onUpdate (prev, {props, context}) {
  	if (!props.step) {
	    const path = props.new
	      ? `/create/${props.draftID}/create`
	      : `/edit/${props.draftID}/create`
	    yield context.setUrl(path, true)
	  }
	},

  controller: {
    * updateGame ({context, props}, data) {
      const ref = props.new ? `/drafts/${props.draftID}` : `/games/${props.draftID}`
      yield context.firebaseUpdate(ref, {
        ...data,
        lastEdited: Date.now()
      })
    },
  	* clickNext ({props, context, actions}) {
  		const s = nextStep(props.new, props.newGame.value.advanced)[props.step]
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
  	* publish ({context, props, state}) {
  		const metaAttrs = ['inputType', 'lastEdited', 'title', 'imageUrl', 'creatorID']
  		const meta = pick(metaAttrs, props.newGame.value)
  		const code = yield createCode()
  		const {firebaseUpdate, firebaseSet, setUrl} = context

  		yield firebaseUpdate(`/games/${props.draftID}`, {
  			...props.newGame.value,
  			shortLink: code,
  			lastEdited: Date.now()
  		})

  		yield firebaseUpdate(`/games/${props.draftID}/meta`, {
  			...meta,
  			animals: props.newGame.value.animals.map(animal => animal.type)
  		})

  		yield firebaseUpdate(`/users/${context.uid}/games/${props.draftID}`, {
  			...meta,
  			animal: props.newGame.value.animals[0].type,
  			ref: props.draftID
  		})

  		yield firebaseUpdate(`/links/${code}`, {
  			type: 'game',
  			payload: props.draftID
  		})

  		yield setUrl(`/${context.username}/authored/challenges`)
      yield firebaseSet(`/users/${context.uid}/drafts/${props.draftID}`, null)
      yield firebaseSet(`/drafts/${props.draftID}`, null)
  	}
  }
}))
