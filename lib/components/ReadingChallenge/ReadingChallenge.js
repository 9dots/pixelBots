/**
 * Imports
 */

import {moveAnimal, paintSquare, turnAnimal} from 'pages/Game/middleware/botsMiddleware'
import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
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
		return {
      frames: [],
      frameNumber: -1,
      ...game,
      ...savedGame,
      saved: true
    }
	},

	* onCreate ({props, actions}) {
		yield actions.gameDidInitialize({...props.game, ...props.savedGame})
	},

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {initialData, animals, active, frameNumber, frames} = state

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
		    			gameActions={actions}
		    			frames={frames}
		    			frameNumber={frameNumber}
		    			/>
					</Block>
					<Block flex tall>
						<GameInput {...props} {...state} gameActions={actions} readOnly />
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
				uid: context.uid
			})
			yield actions.setSaved(true)
  	}
  },

  reducer: {
  	gameDidInitialize: (state, game) => ({
  		ready: true,
  		initialData: game,
  		...game,
  		speed: state.speed,
  		animals: game.animals.map((a) => ({...a, sequence: a.sequence || game.startCode}))
  	}),
    animalPaint: (state, {id, location, color}) => addAction(state, paintSquare({id: state.active, color})),
    animalMove: (state, location) => addAction(state, moveAnimal({id: state.active, getNewLocation: () => location})),
    animalTurn: state => addAction(state, turnAnimal({id: state.active, turn: 90})),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
  	stepForward: () => ({}),
    addFrame: state => ({
      frames: splice(state.frames, state.frameNumber + 1, 0, []),
      frameNumber: state.frameNumber + 1
    }),
    setFrame: (state, frameNumber) => ({frameNumber}),
    nextFrame: state => ({
      frameNumber: Math.min(state.frameNumber + 1, state.frames.length - 1)
    }),
    prevFrame: state => ({
      frameNumber: Math.max(state.frameNumber - 1, 0)
    }),
    removeFrame: state => ({
      frames: splice(state.frames, state.frameNumber, 1)
    }),
  	reset: () => ({
      frames: [],
      frameNumber: -1
    })
  }
}))

/**
 * Helpers
 */

function addAction (state, action) {
  if (state.frameNumber === -1) {
    return {
      error: 'You must add a frame before you can start drawing'
    }
  }

  return {
    frames: splice(frames, state.frameNumber, 1, state.frames[state.frameNumber].concat(action))
  }
}

function updateAnimal (state, path, id, val) {
  return {
    animals: state.animals.map((animal, i) => {
      return i === id
        ? setProp(path, animal, val)
        : animal
    }),
    cursor: Math.min((state.animals[state.active].sequence || []).length, state.cursor)
  }
}
