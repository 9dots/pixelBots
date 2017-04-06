/**
 * Imports
 */

import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
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
  	}
  },

  reducer: {
  	saveFrame: (state, idx, frame) => ({frames: splice(state.frames, state.frameNumber, 1, frame)}),
  	gameDidInitialize: (state, game) => ({
  		ready: true, 
  		initialData: game,
  		...game,
  		speed: state.speed,
  		test: console.log(game.animals[0].sequence, game.startCode),
  		animals: game.animals.map((a) => ({...a, sequence: a.sequence || game.startCode}))
  	}),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
  	stepForward: () => ({}),
  	reset: () => ({})
  }
}))
