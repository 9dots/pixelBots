/**
 * Imports
 */

import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <Reading Challenge/>
 */

export default (component({
	initialState ({props}) {
		const {game, savedGame} = props
		return {...game, ...savedGame, saved: true}
	},

  render ({props, context, state, children}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {initialData, animals, active} = state

  	console.log('reading challenge', game, savedGame)

  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
					</Block>
					<Block flex tall>
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
			    	{category: 'challenge', title: state.title}
			    ]}
			    titleActions={playlist && playlist.actions}
			    titleImg={playlist ? playlist.img : state.imageUrl}>
	    		{gameDisplay}
	    	</Layout>
    	</Block>
    )
  },

  controller: {
  	* save () {
			yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
				lastEdited: Date.now(),
				uid: context.uid,
			})
			yield actions.setSaved(true)
  	}
  },

  reducer: {
  	gameDidInitialize: (state, game) => ({
  		ready: true, 
  		initialData: game,
  		...game,
  		speed: state.speed
  	}),
  	setSaved: (state, saved) => ({saved})
  }
}))
