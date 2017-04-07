/**
 * Imports
 */

import {getFrames, getActions} from 'utils/synchronousRunner'
import {createRunners} from 'pages/Game/utils/runner'
import mw from 'pages/Game/middleware/botsMiddleware'
import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import isIterator from '@f/is-iterator'
import deepEqual from '@f/deep-equal'
import setProp from '@f/set-prop'
import splice from '@f/splice'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <Reading Challenge/>
 */

export default (component({
	initialState ({props}) {
		const {game, savedGame} = props
		return {...game, ...savedGame, saved: true}
	},

	* onCreate ({props, actions}) {
		yield actions.gameDidInitialize({...props.game, ...props.savedGame})
	},

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {initialData, animals, active} = state

  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		  			<GameOutput
		    			{...initialData}
		    			{...omit('runners', state)}
		    			size='350px'
		    			readOnly
		    			active={state.active}
		    			speed={state.speed}
		    			gameActions={actions} />
					</Block>
					<Block flex tall>
						<GameInput {...props} {...state} readOnly gameActions={actions}/>
					</Block>
				</Block>
				{children}
			</Block>
  	)

  	if (draftData) return gameDisplay

    return (
    	<Block tall>
	    	<Layout
			    bodyProps={{display: 'flex', px: '10px'}}
			    navigation={[
			    	playlist && {category: 'playlist', title: playlist.title},
			    	{category: 'reading challenge', title: state.title}
			    ]}
			    titleActions={playlist && playlist.actions}
			    titleImg={playlist ? playlist.img : state.imageUrl}>
	    		{gameDisplay}
	    	</Layout>
    	</Block>
    )
  },

  controller: {
  	* save ({context, actions}) {
			yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
				lastEdited: Date.now(),
				uid: context.uid,
			})
			yield actions.setSaved(true)
  	},
  	* addFrame ({actions, state}) {
  		yield actions.saveFrame(false)
  	},
  	* runCode ({actions, state}) {
  		const runners = yield createRunners(state.animals)
  		const a = runners.map((it) => getActions(it))
  		return yield actions.buildFrames(a)
  	},
  	* buildFrames ({actions, state}, a = []) {
  		const initialBotState = {
  			animals: state.animals,
  			painted: state.painted
  		}
  		return a.map((action, i) => getFrames(action, initialBotState))
  	},
  	* validate ({actions, state}) {
  		const testFrames = [[
  		  			[
  		  				{type: 'animalMove', payload: {id: 0, location: [2 , 0]}},
  		  				{type: 'animalMove', payload: {id: 0, location: [1 , 0]}}
  		  			],
  		  		]]

  		const {frames = testFrames} = state
  		const userFrames = yield actions.buildFrames(frames)
  		const codeFrames = yield actions.runCode()
  		console.log(userFrames, codeFrames)
  		const diff = userFrames.map((f, i) => validateFrame(f[0], codeFrames[0][i]))
  	}
  },

  reducer: {
  	saveFrame: (state, idx, frame) => ({frames: splice(state.frames, state.frameNumber, 1, frame)}),
  	gameDidInitialize: (state, game) => ({
  		ready: true, 
  		initialData: game,
  		...game,
  		speed: state.speed,
  		animals: game.animals.map((a) => ({...a, sequence: a.sequence || game.startCode}))
  	}),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
  	stepForward: () => ({}),
  	reset: () => ({})
  },

  mw: [mw]
}))

function validateFrame (a, b) {
	console.log(a,b)
	return deepEqual(a, b)
}
